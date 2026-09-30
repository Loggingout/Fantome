import { Printer } from "lucide-react";

export default function DownloadPayStubButton() {
  const handlePrint = () => {
    const el = document.getElementById("pay-stub-preview");
    if (!el) { window.print(); return; }

    const win = window.open("", "_blank");
    if (!win) return;

    // Clone all compiled stylesheets/style tags so Tailwind classes (and the
    // brand gradient/colors) render correctly in the print window, and add a
    // <base> tag so relative asset URLs (like the logo) resolve correctly.
    const styleTags = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style')
    )
      .map((node) => node.outerHTML)
      .join("\n");

    win.document.write(`
      <html>
        <head>
          <title>Pay Stub</title>
          <base href="${window.location.origin}/" />
          ${styleTags}
          <style>
            body { background: #0a0a0f; padding: 2rem; margin: 0; }
            @media print {
              body { background: #0a0a0f !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>`);
    win.document.close();

    // Wait for stylesheets/images to load before triggering print
    win.onload = () => win.print();
    setTimeout(() => win.print(), 300);
  };

  return (
    <button
      onClick={handlePrint}
      className="mt-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 px-6 font-semibold hover:from-purple-500 hover:to-pink-500 transition"
    >
      <Printer className="w-4 h-4" />
      Download / Print Pay Stub
    </button>
  );
}
