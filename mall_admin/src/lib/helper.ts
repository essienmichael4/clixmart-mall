const CURRENCY_FORMATTER = new Intl.NumberFormat("en-GH", {
    style: "currency", currency: "GHS"
})

export const ACTION_OPTIONS = [
  "ALL",
  "PAYOUT_INITIATED",
  "PAYOUT_COMPLETED",
  "PAYOUT_FAILED",
  "REVENUE_PROCESSED",
  "REVENUE_PROCESS_FAILED",
  "COMMISSION_PROCESSED",
  "STORE_UPDATED",
];

export const FormattedDate = (date:Date) => {
    return date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
}

export const FormattedTime = (date:Date) => {
    return date.toLocaleTimeString("default", {
        timeZone: "UTC",
    })
}

export const FormatCurrency = (price: number) => {
    return CURRENCY_FORMATTER.format(price)
}
