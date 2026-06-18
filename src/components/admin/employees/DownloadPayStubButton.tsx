import { Printer } from "lucide-react";

export default function DownloadPayStubButton() {
  const handlePrint = () => {
    const el = document.getElementById("pay-stub-preview");
    if (!el) { window.print(); return; }
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Pay Stub</title>
          <style>
            body { font-family: Georgia, serif; background: #000; color: #fff; padding: 2rem; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>${el.innerHTML}</body>
      </html>`);
    win.document.close();
    win.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="mt-6 flex items-center gap-2 bg-white text-black rounded-xl py-3 px-6 font-semibold hover:bg-neutral-200 transition"
    >
      <Printer className="w-4 h-4" />
      Download / Print Pay Stub
    </button>
  );
}
