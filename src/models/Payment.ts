export interface PaymentDetails {
    accountNumber: string;
    amount: number;
    bin: string;
    checkoutUrl: string;
    currency: string;
    description: string;
    expiredAt: string | null;
    orderCode: number;
    paymentLinkId: string;
    qrCode: string;
    status: string;
}
export interface HandleResponse {
    staffId: string;
    transactionInfo: string;
    transactionNumber: string;
    isSuccess: boolean;
}
export interface CheckBuyPackage {
    packageId: string;
    staffId: string;
}
export interface Transaction {
    transactionId: number;
    methodId: number;
    universityPackageId: number;
    amount: number;
    paymentDate: Date;
    status: string;
}