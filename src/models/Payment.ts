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
export interface Transaction {
    transactionId: string;
    amount: number;
    paymentDate: string; // ISO 8601 format
    universityName: string;
    methodName: string;
    packageName: string;
    transactionNumber: string;
    transactionInfo: string;
    contractUrl: string;
    type:  string; // Enum nếu có danh sách cụ thể
    status:  string;
  }