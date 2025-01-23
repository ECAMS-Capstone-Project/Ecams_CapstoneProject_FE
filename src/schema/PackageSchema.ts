import { z } from "zod";
export const editPackageSchema = z.object({
    PackageId: z.string().min(1, { message: "Package Id is Required" }),
    Name: z.string().min(1, { message: "Package Name is Required" }),
    Price: z.coerce.number().refine((value) => value > 0, {
      message: "Price must be greater than 0.",
    }),
    Duration: z.coerce.number().refine((value) => value > 0, {
      message: "Duration must be greater than 0.",
    }),
    Description: z.string().min(1, { message: "Description is Required" }),
    EndOfSupportDate: z.string().min(1, { message: "Ended Date is Required" }),
    Status: z.string().nullable(),
    Type: z.string().min(1, { message: "Type is Required" }),
    Value:  z.string().min(1, { message: "Value is Required" }),
  });