import { Transaction } from "./Payment";

export interface Contract {
    contractId: string;
    staffName: string;
    universityName: string;
    packageName: string;
    signedDate: string; // ISO 8601 format
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    contractUrl: string;
    status: boolean;
    transactions?: Transaction[]; // Optional vì Get All không có
  }