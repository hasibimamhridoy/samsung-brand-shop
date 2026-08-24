import { brand } from "@/config/brand";
import { formatAmount } from "@/lib/format";
import type { InvoiceItem } from "@/types/invoice";

const MIN_ROWS = 6;

interface InvoicePreviewProps {
  memoNo: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  totalDiscount: number;
  grandTotal: number;
}

function lineTotal(item: InvoiceItem): number {
  const subtotal = item.qty * item.unitPrice;
  const discount = Math.min(Math.max(item.discount, 0), subtotal);
  return subtotal - discount;
}

export default function InvoicePreview({
  memoNo,
  date,
  customerName,
  customerPhone,
  customerAddress,
  items,
  totalDiscount,
  grandTotal,
}: InvoicePreviewProps) {
  const filledRows = items.filter((item) => item.name.trim().length > 0);
  const blankRowCount = Math.max(MIN_ROWS - filledRows.length, 0);

  return (
    <div
      id="invoice-preview"
      className="mx-auto w-full max-w-[700px] bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 print:shadow-none print:ring-0"
    >
      <div className="px-8 pt-8 pb-4 text-center">
        <h1 className="font-serif text-4xl font-black tracking-tight text-blue-900">
          {brand.brandLine}
        </h1>
        <p className="mt-0.5 font-serif text-xl font-bold tracking-tight text-blue-900">
          {brand.shopNameLine}
        </p>
        <p className="mt-1 text-sm italic text-slate-500">{brand.tagline}</p>
        <p className="mt-2 text-xs text-slate-600">{brand.address}</p>
        <p className="text-xs font-semibold text-slate-700">
          {brand.shopPhoneLabel}: {brand.shopPhone} &nbsp;|&nbsp;{" "}
          {brand.managerPhoneLabel}: {brand.managerPhone}
        </p>
      </div>

      <div className="bg-blue-900 py-2 text-center text-lg font-bold tracking-[0.2em] text-white">
        {brand.memoTitle}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2 px-8 pt-4 text-sm">
        <span>
          <span className="font-semibold">Memo No:</span>{" "}
          <span className="font-mono">{memoNo || "—"}</span>
        </span>
        <span>
          <span className="font-semibold">Date:</span> {date || "—"}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-8 pt-2 text-sm">
        <span>
          <span className="font-semibold">Customer Name:</span>{" "}
          {customerName || (
            <span className="inline-block w-40 border-b border-slate-400" />
          )}
        </span>
        <span>
          <span className="font-semibold">Phone:</span>{" "}
          {customerPhone || (
            <span className="inline-block w-32 border-b border-slate-400" />
          )}
        </span>
      </div>
      <div className="px-8 pt-2 pb-4 text-sm">
        <span className="font-semibold">Address:</span>{" "}
        {customerAddress || (
          <span className="inline-block w-64 border-b border-slate-400" />
        )}
      </div>

      <div className="px-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="w-10 border border-slate-300 px-2 py-2 text-center font-semibold">
                {brand.tableHeaders.sl}
              </th>
              <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                {brand.tableHeaders.itemDescription}
              </th>
              <th className="w-16 border border-slate-300 px-2 py-2 text-center font-semibold">
                {brand.tableHeaders.qty}
              </th>
              <th className="w-24 border border-slate-300 px-2 py-2 text-center font-semibold">
                {brand.tableHeaders.unitPrice}
              </th>
              <th className="w-20 border border-slate-300 px-2 py-2 text-center font-semibold">
                {brand.tableHeaders.discount}
              </th>
              <th className="w-28 border border-slate-300 px-2 py-2 text-center font-semibold">
                {brand.tableHeaders.total}
              </th>
            </tr>
          </thead>
          <tbody>
            {filledRows.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-slate-300 px-2 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-slate-300 px-2 py-2">
                  {item.name}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-center">
                  {item.qty}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-right">
                  {formatAmount(item.unitPrice)}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-right">
                  {item.discount > 0 ? formatAmount(item.discount) : "—"}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-right">
                  {formatAmount(lineTotal(item))}
                </td>
              </tr>
            ))}
            {Array.from({ length: blankRowCount }).map((_, index) => (
              <tr key={`blank-${index}`}>
                <td className="border border-slate-300 px-2 py-3">&nbsp;</td>
                <td className="border border-slate-300 px-2 py-3">&nbsp;</td>
                <td className="border border-slate-300 px-2 py-3">&nbsp;</td>
                <td className="border border-slate-300 px-2 py-3">&nbsp;</td>
                <td className="border border-slate-300 px-2 py-3">&nbsp;</td>
                <td className="border border-slate-300 px-2 py-3">&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {totalDiscount > 0 && (
              <tr className="bg-slate-50 font-semibold">
                <td
                  colSpan={5}
                  className="border border-slate-300 px-2 py-2 text-right"
                >
                  {brand.totalDiscountLabel}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-right">
                  - {brand.currencySymbol} {formatAmount(totalDiscount)}
                </td>
              </tr>
            )}
            <tr className="bg-slate-100 font-bold">
              <td
                colSpan={5}
                className="border border-slate-300 px-2 py-2 text-right"
              >
                {brand.grandTotalLabel}
              </td>
              <td className="border border-slate-300 px-2 py-2 text-right">
                {brand.currencySymbol} {formatAmount(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="px-8 pt-5 text-[11px] italic text-slate-600">
        <p className="font-semibold not-italic">Note:</p>
        <ul className="list-inside list-disc space-y-0.5">
          {brand.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between px-8 pt-14 pb-3 text-xs">
        <span className="border-t border-slate-400 pt-1">
          {brand.customerSignatureLabel}
        </span>
        <span className="border-t border-slate-400 pt-1">
          {brand.authorizedSignatureLabel}
        </span>
      </div>

      <div className="border-t border-slate-200 px-8 py-4 text-center">
        <p className="font-serif text-sm font-bold text-blue-900">
          {brand.footerThanksLine}
        </p>
        <p className="text-xs italic text-slate-500">
          {brand.footerSignatureLine}
        </p>
      </div>
    </div>
  );
}
