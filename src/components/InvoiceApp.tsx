"use client";

import { useEffect, useId, useRef, useState } from "react";
import { brand } from "@/config/brand";
import { generateMemoNo } from "@/lib/memo";
import { formatDate } from "@/lib/format";
import type { InvoiceItem } from "@/types/invoice";
import InvoicePreview from "@/components/InvoicePreview";

function emptyItem(): InvoiceItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    qty: 1,
    unitPrice: 0,
    discount: 0,
  };
}

function lineTotal(item: InvoiceItem): number {
  const subtotal = item.qty * item.unitPrice;
  const discount = Math.min(Math.max(item.discount, 0), subtotal);
  return subtotal - discount;
}

export default function InvoiceApp() {
  const [memoNo, setMemoNo] = useState("");
  const [date, setDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [isDownloading, setIsDownloading] = useState(false);
  const formId = useId();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Memo number and date depend on localStorage / the client clock, so
    // they can only be produced after mount — not derivable during render.
    // The ref guard keeps this a single draw even under Strict Mode's
    // double-invoked effects, since generateMemoNo mutates localStorage.
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    setMemoNo(generateMemoNo(brand.memoPrefix));
    setDate(formatDate(new Date()));
  }, []);

  const totalDiscount = items.reduce(
    (sum, item) =>
      sum + Math.min(Math.max(item.discount, 0), item.qty * item.unitPrice),
    0,
  );
  const grandTotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  function updateItem(id: string, patch: Partial<InvoiceItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(id: string) {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== id) : prev,
    );
  }

  function startNewInvoice() {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setItems([emptyItem()]);
    setDate(formatDate(new Date()));
    setMemoNo(generateMemoNo(brand.memoPrefix));
  }

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    const element = document.getElementById("invoice-preview");
    if (!element) return;

    setIsDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] =
        await Promise.all([import("html2canvas-pro"), import("jspdf")]);

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      // JPEG keeps the PDF a few hundred KB; jsPDF embeds PNG data
      // uncompressed, which would otherwise balloon it to several MB.
      const imageData = canvas.toDataURL("image/jpeg", 0.92);

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imageData, "JPEG", 0, 0, pageWidth, imageHeight);
      pdf.save(`${memoNo || "invoice"}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-start md:gap-10 md:px-8">
      <section className="no-print w-full max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:w-105 md:shrink-0">
        <div className="flex items-center gap-6 rounded-xl bg-slate-50 px-4 py-3 text-sm">
          <div>
            <p className="text-slate-500">মেমো নং</p>
            <p className="font-mono font-semibold text-slate-800">
              {memoNo || "…"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">তারিখ</p>
            <p className="font-semibold text-slate-800">{date || "…"}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">
            কাস্টমার তথ্য
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">কাস্টমারের নাম</span>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="কাস্টমারের নাম লিখুন"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">মোবাইল নম্বর</span>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">কাস্টমারের ঠিকানা</span>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="কাস্টমারের ঠিকানা লিখুন"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              আইটেম সমূহ
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="rounded-full bg-blue-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-800"
            >
              + আইটেম যোগ করুন
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    আইটেম {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="text-xs font-medium text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    বাদ দিন
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, { name: e.target.value })
                    }
                    placeholder="আইটেমের নাম"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:col-span-3"
                  />
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, {
                        qty: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="পরিমাণ"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:col-span-1"
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, {
                        unitPrice: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="একক মূল্য"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:col-span-2"
                  />
                  <label className="block text-sm sm:col-span-3">
                    <span className="mb-1 block text-xs text-slate-500">
                      ডিস্কাউন্ট ({brand.currencySymbol})
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(item.id, {
                          discount: Number(e.target.value) || 0,
                        })
                      }
                      placeholder="ডিস্কাউন্ট"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </label>
                  <div className="flex items-end justify-end text-sm font-medium text-slate-600 sm:col-span-3">
                    লাইন টোটাল: {brand.currencySymbol}{" "}
                    {lineTotal(item).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1 rounded-xl bg-blue-50 px-4 py-3 text-sm">
            {totalDiscount > 0 && (
              <div className="flex items-center justify-between text-blue-800">
                <span>মোট ডিস্কাউন্ট</span>
                <span>
                  - {brand.currencySymbol} {totalDiscount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between font-semibold text-blue-900">
              <span>গ্র্যান্ড টোটাল</span>
              <span>
                {brand.currencySymbol} {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            প্রিন্ট করুন
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-1 rounded-lg border border-blue-900 px-4 py-2.5 text-sm font-semibold text-blue-900 transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60"
          >
            {isDownloading ? "তৈরি হচ্ছে…" : "ডাউনলোড (PDF)"}
          </button>
          <button
            type="button"
            onClick={startNewInvoice}
            className="w-full rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            নতুন ইনভয়েস শুরু করুন
          </button>
        </div>
      </section>

      <section className="w-full flex-1 overflow-x-auto" aria-labelledby={formId}>
        <h2 id={formId} className="sr-only">
          Invoice preview
        </h2>
        <InvoicePreview
          memoNo={memoNo}
          date={date}
          customerName={customerName}
          customerPhone={customerPhone}
          customerAddress={customerAddress}
          items={items}
          totalDiscount={totalDiscount}
          grandTotal={grandTotal}
        />
      </section>
    </div>
  );
}
