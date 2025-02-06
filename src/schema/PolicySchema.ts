/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const PolicySchema = z.object({
    policyId: z.string().uuid().optional(),
    title: z.string().min(1, {message: "Title is required!"}),
    description: z.string().min(1, {message: "Description is required!"}),
    effectiveAt: z.coerce.date().superRefine((date, ctx) => {
        const parsedDate = Date.parse(date.toString());
        if (isNaN(parsedDate)) {
          ctx.addIssue({ code: "custom", message: "Invalid date format" });
        }
        const createdDate = (ctx as any).parent?.createdDate ? Date.parse((ctx as any).parent.createdDate) : null;
        if (createdDate && parsedDate <= createdDate) {
          ctx.addIssue({ code: "custom", message: "Effective date must be after created date." });
        }
      }),
    status: z.boolean(),
    createdDate: z.date().optional(),
    updatedDate: z.date().optional(),
    roleName: z.array(z.string()),
  });