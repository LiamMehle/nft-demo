enum Status {
    "success",
    "failure"
}
interface Decimal {
    mantissa: Number|undefined,
    exponent: Number|undefined
}
interface GiveTokenRequest {
    targetWallet: string,
    amount: Decimal
}
interface GiveTokenResponse {
    status: "success" | "failure",
    reason: string|undefined,
    targetWallet: string
}