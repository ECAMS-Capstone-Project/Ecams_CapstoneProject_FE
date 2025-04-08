import * as z from 'zod'
export const WalletSchema = z.object({
    walletId: z.string().optional(),  // walletId chỉ có trong PUT, không có trong POST
    universityId: z.string().min(1, "University ID is required"),
    apiKey: z.string().min(1, "Api Key is required"),
    clientId: z.string().min(1, "Client ID is required"),
    checkSumKey: z.string().min(1, "CheckSumKey is required"),
    bankName: z.string().min(1, "Bank is required"),
    walletName: z.string().min(1, "Wallet's name is required"),
  });
  export type Wallet = z.infer<typeof WalletSchema>