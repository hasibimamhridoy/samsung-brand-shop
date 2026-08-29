// All shop-specific text lives here so the invoice can be rebranded
// without touching any component or layout code.
export const brand = {
  brandLine: "Samsung",
  shopNameLine: "Smart Brand Shop",
  tagline: "Mobile Phone, Accessories",
  address: "Sardar Garden City Shopping Center, Ghosh Para, Kurigram",

  shopPhoneLabel: "Shop",
  shopPhone: "+8801334015725",
  managerPhoneLabel: "Manager",
  managerPhone: "+8801751169599",

  memoTitle: "CASH MEMO",
  memoPrefix: "SM-",
  currencySymbol: "Tk.",

  tableHeaders: {
    sl: "SL",
    itemDescription: "Item Description",
    imei: "IMEI",
    qty: "Qty",
    unitPrice: "Unit Price",
    discount: "Discount",
    total: "Total",
  },
  grandTotalLabel: "Grand Total",
  totalDiscountLabel: "Total Discount",

  notes: [
    "Goods once sold will not be returned or exchanged without prior approval.",
    "Please check your product and warranty card before leaving the shop.",
    "Keep this memo safe for any warranty or service claim.",
  ],

  customerSignatureLabel: "Customer Signature",
  authorizedSignatureLabel: "Authorized Signature",

  footerThanksLine: "Thank You for Shopping with Us!",
  footerSignatureLine: "— Manager, Adib Al Musfique",
} as const;
