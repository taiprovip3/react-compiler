export interface Token {
    id: number;
    type: "ACCESS" | "REFRESH";
    value: string;
    expiryDate: string;
    disabled: boolean;
}