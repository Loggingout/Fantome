import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { afterEach, mock, test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import express from "express";
import { WebsiteAnalyticsEvent } from "../backend/models/WebsiteAnalyticsEvent.js";
import { getWebsiteAnalyticsSummary, recordWebsiteAnalyticsEvent } from "../backend/controllers/websiteAnalyticsController.js";

const policySource = await readFile(new URL("../frontend/src/utils/websiteAnalyticsPolicy.ts", import.meta.url), "utf8");
const policyJs = ts.transpileModule(policySource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const policyExports = {};
runInNewContext(policyJs, { exports: policyExports });
const { isAnalyticsHost, getAnalyticsSession } = policyExports;

const response = () => ({
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
  end() { return this; },
});

afterEach(() => mock.restoreAll());

test("only production domains are tracked", () => {
  assert.equal(isAnalyticsHost("fantometechnologies.com", true), true);
  assert.equal(isAnalyticsHost("www.fantometechnologies.com", true), true);
  assert.equal(isAnalyticsHost("workspace-5173.app.github.dev", true), false);
  assert.equal(isAnalyticsHost("localhost", true), false);
  assert.equal(isAnalyticsHost("www.fantometechnologies.com", false), false);
});

test("sessions renew after activity and expire after 30 minutes idle", () => {
  const data = new Map();
  const storage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
  let created = 0;
  const createId = () => `session-${++created}`;
  assert.equal(getAnalyticsSession(storage, 1000, createId), "session-1");
  assert.equal(getAnalyticsSession(storage, 1000 + 29 * 60_000, createId), "session-1");
  assert.equal(getAnalyticsSession(storage, 1000 + 58 * 60_000, createId), "session-1");
  assert.equal(getAnalyticsSession(storage, 1000 + 89 * 60_000, createId), "session-2");
});

test("production beacons are recorded while Codespaces and local events are ignored", async () => {
  const create = mock.method(WebsiteAnalyticsEvent, "create", async () => ({}));
  const body = JSON.stringify({ eventType: "visit", sessionId: "a".repeat(32), page: "/blog" });
  for (const [origin, expected] of [
    ["https://www.fantometechnologies.com", 202],
    ["https://fantometechnologies.com", 202],
    ["https://workspace-5173.app.github.dev", 204],
    ["http://localhost:5173", 204],
    [undefined, 204],
  ]) {
    const res = response();
    await recordWebsiteAnalyticsEvent({ get: (name) => name === "origin" ? origin : undefined, body }, res);
    assert.equal(res.statusCode, expected);
  }
  assert.equal(create.mock.callCount(), 2);
  assert.equal(create.mock.calls[0].arguments[0].page, "/blog");
});

test("summary counts visits and distinct browser sessions independently", async () => {
  const now = new Date();
  const events = [
    { eventType: "visit", sessionId: "first-session", page: "/", createdAt: now },
    { eventType: "visit", sessionId: "first-session", page: "/blog", createdAt: now },
    { eventType: "visit", sessionId: "second-session", page: "/blog", createdAt: now },
    { eventType: "duration", sessionId: "first-session", page: "/", durationMs: 12000, createdAt: now },
  ];
  mock.method(WebsiteAnalyticsEvent, "find", () => ({
    select() { return this; },
    sort() { return this; },
    limit() { return this; },
    async lean() { return events; },
  }));
  const res = response();
  await getWebsiteAnalyticsSummary({}, res);
  assert.equal(res.body.totals.visits, 3);
  assert.equal(res.body.totals.uniqueVisitors, 2);
  assert.equal(res.body.totals.averageVisitSeconds, 12);
  assert.equal(res.body.topPages.find((page) => page.page === "/blog").visits, 2);
});

test("the HTTP route accepts production text beacons and protects its summary", async () => {
  process.env.JWT_SECRET ||= "website-analytics-test-secret";
  const { default: router } = await import("../backend/routes/websiteAnalyticsRoutes.js");
  const create = mock.method(WebsiteAnalyticsEvent, "create", async () => ({}));
  const app = express();
  app.use(express.json());
  app.use("/api/website-analytics", router);
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });

  try {
    const base = `http://127.0.0.1:${server.address().port}/api/website-analytics`;
    const body = JSON.stringify({ eventType: "visit", sessionId: "b".repeat(32), page: "/" });
    const send = (origin) => fetch(`${base}/events`, {
      method: "POST",
      headers: { "Content-Type": "text/plain", Origin: origin },
      body,
    });
    assert.equal((await send("https://www.fantometechnologies.com")).status, 202);
    assert.equal((await send("https://workspace-5173.app.github.dev")).status, 204);
    assert.equal(create.mock.callCount(), 1);
    assert.equal((await fetch(`${base}/summary`)).status, 401);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test("the client sends one duration for the original page when leaving for admin", async () => {
  const source = (await readFile(new URL("../frontend/src/utils/websiteAnalytics.ts", import.meta.url), "utf8"))
    .replace("import.meta.env.PROD", "true");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const listeners = new Map();
  const beacons = [];
  const data = new Map();
  let cleanup;
  const browser = {
    location: { hostname: "www.fantometechnologies.com", pathname: "/blog" },
    sessionStorage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, value),
    },
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  };
  const modules = {
    react: { useRef: () => ({ current: null }), useEffect: (callback) => { cleanup = callback(); } },
    "react-router-dom": { useLocation: () => ({ pathname: browser.location.pathname }) },
    "./api": { default: { defaults: { baseURL: "https://api.example.test/api" } } },
    "./websiteAnalyticsPolicy": policyExports,
  };
  const clientExports = {};
  runInNewContext(compiled, {
    exports: clientExports,
    require: (name) => modules[name],
    window: browser,
    navigator: { sendBeacon: (_url, body) => { beacons.push(body); return true; } },
    crypto: { randomUUID: () => "11111111-1111-4111-8111-111111111111" },
    Blob,
    Date,
  });
  clientExports.useWebsiteVisitTracker();
  browser.location.pathname = "/admin";
  listeners.get("pagehide")();
  cleanup();
  const events = await Promise.all(beacons.map(async (body) => JSON.parse(await body.text())));
  assert.deepEqual(events.map((event) => event.eventType), ["visit", "duration"]);
  assert.equal(events[1].page, "/blog");
  assert.equal(events[1].sessionId, events[0].sessionId);
});