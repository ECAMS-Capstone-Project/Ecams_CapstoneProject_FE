export interface Transaction {
    transactionId: number;
    methodId: number;
    universityPackageId: number;
    amount: number;
    paymentDate: Date;
    status: string;
  }