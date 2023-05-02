let formatCurrency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
});
export const useDollar = (dollar: number) => {
    let money = formatCurrency.format(dollar);

    return money
}