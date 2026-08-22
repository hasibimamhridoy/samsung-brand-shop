import InvoiceApp from "@/components/InvoiceApp";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex-1">
        <InvoiceApp />
      </main>
    </div>
  );
}
