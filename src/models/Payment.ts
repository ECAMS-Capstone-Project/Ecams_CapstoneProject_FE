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