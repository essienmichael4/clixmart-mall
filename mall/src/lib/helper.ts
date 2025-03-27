const CURRENCY_FORMATTER = new Intl.NumberFormat("en-GH", {
    style: "currency", currency: "GHS"
})

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

export const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"})
}
