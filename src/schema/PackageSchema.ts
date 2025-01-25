import { z } from "zod";

export const editPackageSchema = z.object({
  // packageId: z.string().min(1, { message: "Package ID is required" }),
  packageName: z.string().min(1, { message: "Package Name is required" }),
  // createdBy: z.string().min(1, { message: "Created By is required" }),
  // updatedBy: z.string().nullable().optional(), // Can be null or undefined
  price: z.coerce.number().min(0, { message: "Price must be greater than or equal to 0" }),
  status: z.boolean({ required_error: "Status is required" }),
  duration: z.coerce.number().min(1, { message: "Duration must be greater than 0" }),
  description: z.string().min(1, { message: "Description is required" }),
  endOfSupportDate: z.string().nullable().optional(), // Can be null or undefined
  packageDetails: z
    .array(
      z.object({

        packageType: z.string().min(1, { message: "Package Type is required" }),
        value: z.string().min(1, { message: "Value is required" }),
      })
    )
    .min(1, { message: "At least one package detail is required" }), // Ensure at least one detail exists
});
