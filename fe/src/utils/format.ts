export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

export const formatNumber = (value: number): string => {
    return value.toLocaleString("vi-VN");
};  