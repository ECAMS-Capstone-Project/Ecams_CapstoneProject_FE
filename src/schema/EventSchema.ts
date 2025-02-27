/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const EventAreasSchema = z.object({
    // Define your EventAreas structure here (example)
    areaId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
  });

export const EventSchema = z.object({
    eventId: z.string().uuid().optional(), // Validate UUID cho eventId
    universityId: z.string().uuid(),
    representativeId: z.string().uuid().optional(), // Validate UUID cho representativeId
    representativeName: z.string().optional(), // Có thể là string hoặc null
    clubId: z.string().optional(), // Có thể là string hoặc null
    clubName: z.string().optional(), // Có thể là string hoặc null
    eventName: z.string().min(1, { message: "Event name is required" }), // Event name không được rỗng
    // startDate: z.date(), // Kiểm tra là đối tượng Date hợp lệ
    // endDate: z.coerce.date().superRefine((date, ctx) => {
    //     const parsedDate = Date.parse(date.toString());
    //     if (isNaN(parsedDate)) {
    //       ctx.addIssue({ code: "custom", message: "Invalid date format" });
    //     }
    //     const startDate = (ctx as any).parent?.startDate ? Date.parse((ctx as any).parent.startDate) : null;
    //     if (startDate && parsedDate <= startDate) {
    //       ctx.addIssue({ code: "custom", message: "Ended date must be after created date." });
    //     }
    //   }), // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu
    registeredStartDate: z.date(), // Kiểm tra là đối tượng Date hợp lệ
    registeredEndDate:  z.coerce.date().superRefine((date, ctx) => {
        const parsedDate = Date.parse(date.toString());
        if (isNaN(parsedDate)) {
          ctx.addIssue({ code: "custom", message: "Invalid date format" });
        }
        const registeredStartDate = (ctx as any).parent?.registeredStartDate ? Date.parse((ctx as any).parent.registeredStartDate) : null;
        if (registeredStartDate && parsedDate <= registeredStartDate) {
          ctx.addIssue({ code: "custom",  message: "Registered end date must be after registered start date", });
        }
      }),
     
 // Kiểm tra ngày kết thúc đăng ký phải lớn hơn ngày bắt đầu đăng ký
    price: z.coerce.number().positive({ message: "Price must be a positive number" }), // Kiểm tra giá trị price là số nguyên và dương
    maxParticipants: z.coerce.number().int().positive({ message: "Max participants must be a positive integer" }), // Kiểm tra maxParticipants là số nguyên và dương
    status: z.string().optional(), // Kiểm tra status không rỗng
    eventAreas: z
  .array(
    z.object({
      areaId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .superRefine((areas, ctx) => {
    const ids = areas.map((a) => a.areaId);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Area is not allowed to be duplicated.",
        path: ["_error"], // Đặt lỗi toàn cục của mảng vào _error
      });
    }
  }),

   // eventAreas là mảng tùy chọn, nếu có
    feedbacks: z.array(z.unknown()).optional(), // feedbacks là mảng tùy chọn, nếu có
    imageUrl: z
    .union([
      z.string().url("Invalid image URL").optional(),  // Nếu có URL ảnh
      z.instanceof(File).refine((file) => file instanceof File, {
        message: "Image must be a file", // Kiểm tra nếu là file ảnh
      }).optional(),
    ]),
    description: z.string(),
    eventType: z.string()

});
