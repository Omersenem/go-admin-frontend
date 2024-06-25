export const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(balance)
}