/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const EventAreasSchema = z
  .array(
    z.object({
      areaId: z.string(),
      startDate: z.date().min(new Date(), {
        message: "Start date must be in the future",
      }),
      endDate: z.date().min(new Date(), {
        message: "End date must be in the future",
      }),
    })
  )
  .refine(
    (data) => {
      return data.every((item) => item.endDate > item.startDate);
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    }
  )
  .refine((areas) => {
    const ids = areas.map((a) => a.areaId);
    if (new Set(ids).size !== ids.length) {
      return {
        code: z.ZodIssueCode.custom,
        message: "Area is not allowed to be duplicated",
        path: ["_error"],
      };
    }
    return true;
  });

export const EventSchema = z
  .object({
    eventId: z.string().uuid().optional(), // Validate UUID cho eventId
    universityId: z.string().uuid(),
    representativeId: z.string().optional(), // Validate UUID cho representativeId
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
    registeredStartDate: z.coerce.date().min(new Date(), {
      message: "Registered start date must be in the future",
    }), // Kiểm tra là đối tượng Date hợp lệ
    registeredEndDate: z.coerce.date(), // Kiểm tra là đối tượng Date hợp lệ

    // Kiểm tra ngày kết thúc đăng ký phải lớn hơn ngày bắt đầu đăng ký
    fieldIds: z.array(z.string()),
    price: z.coerce
      .number()
      .min(0, { message: "Price must be a positive number" }), // Kiểm tra giá trị price là số nguyên và dương
    maxParticipants: z.coerce
      .number()
      .int()
      .positive({ message: "Max participants must be a positive integer" }), // Kiểm tra maxParticipants là số nguyên và dương
    status: z.string().optional(), // Kiểm tra status không rỗng
    walletId: z.string().optional(),
    eventAreas: z
      .array(
        z.object({
          AreaId: z.string(),
          Date: z.coerce.date(),
          StartTime: z.string(),
          EndTime: z.string(),
        })
      )
      .superRefine((data, ctx) => {
        // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
        if (
          !data.every(
            (item) => parseInt(item.EndTime) > parseInt(item.StartTime)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End time must be after start time",
            path: ["_error"],
          });
        }

        // Kiểm tra ngày phải trong tương lai
        const now = new Date().getTime();
        if (!data.every((item) => new Date(item.Date).getTime() > now)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date must be in the future",
            path: ["_error"],
          });
        }

        // Kiểm tra ngày phải sau registered end date
        const parentData = (ctx as any).parent;
        if (parentData?.registeredEndDate) {
          const registeredEndTimestamp = new Date(
            parentData.registeredEndDate
          ).getTime();
          const hasInvalidDate = data.some(
            (item) => new Date(item.Date).getTime() <= registeredEndTimestamp
          );
          if (hasInvalidDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Area date must be after registered end date",
              path: ["_error"],
            });
          }
        }
      })
      .refine(
        (areas) => {
          const ids = areas.map((a) => a.AreaId);
          const uniqueSize = new Set(ids).size;
          return uniqueSize === ids.length;
        },
        {
          message: "Area is not allowed to be duplicated",
          path: ["_error"],
        }
      ),

    // eventAreas là mảng tùy chọn, nếu có
    feedbacks: z.array(z.unknown()).optional(), // feedbacks là mảng tùy chọn, nếu có
    imageUrl: z.union([
      z.string().url("Invalid image URL").optional(), // Nếu có URL ảnh
      z
        .instanceof(File)
        .refine((file) => file instanceof File, {
          message: "Image must be a file", // Kiểm tra nếu là file ảnh
        })
        .optional(),
    ]),
    description: z.string().min(1, { message: "Description is required" }),
    eventType: z.string().min(1, { message: "Event type is required" }),
    trainingPoint: z.coerce
      .number()
      .min(0, { message: "Training point must be a positive number" })
      .max(30, { message: "Training point must be less than 30" }),
  })
  .refine((data) => data.registeredEndDate > data.registeredStartDate, {
    message: "Registered end date must be after registered start date",
    path: ["registeredEndDate"],
  });

export const InterClubEventSchema = z.object({
  userId: z.string().optional(),
  eventId: z.string().uuid().optional(), // Validate UUID cho eventId
  universityId: z.string().uuid(),
  // representativeName: z.string().optional(), // Có thể là string hoặc null
  // clubName: z.string().optional(), // Có thể là string hoặc null
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
  listClubName: z.array(z.string()),
  registeredStartDate: z.date(), // Kiểm tra là đối tượng Date hợp lệ
  registeredEndDate: z.coerce.date().superRefine((date, ctx) => {
    const parsedDate = Date.parse(date.toString());
    if (isNaN(parsedDate)) {
      ctx.addIssue({ code: "custom", message: "Invalid date format" });
    }
    const registeredStartDate = (ctx as any).parent?.registeredStartDate
      ? Date.parse((ctx as any).parent.registeredStartDate)
      : null;
    if (registeredStartDate && parsedDate <= registeredStartDate) {
      ctx.addIssue({
        code: "custom",
        message: "Registered end date must be after registered start date",
      });
    }
  }),

  // Kiểm tra ngày kết thúc đăng ký phải lớn hơn ngày bắt đầu đăng ký
  price: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" }), // Kiểm tra giá trị price là số nguyên và dương
  maxParticipants: z.coerce
    .number()
    .int()
    .positive({ message: "Max participants must be a positive integer" }), // Kiểm tra maxParticipants là số nguyên và dương
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
  imageUrl: z.union([
    z.string().url("Invalid image URL").optional(), // Nếu có URL ảnh
    z
      .instanceof(File)
      .refine((file) => file instanceof File, {
        message: "Image must be a file", // Kiểm tra nếu là file ảnh
      })
      .optional(),
  ]),
  description: z.string(),
  eventType: z.string(),
  trainingPoint: z.coerce
    .number()
    .min(0, { message: "Training point must be a positive number" })
    .max(30, { message: "Training point must be less than 30" }),
});

export const EventClubSchema = z.object({
  userId: z.string().optional(),
  clubName: z.string().min(3, "Club name must be at least 3 characters"),
  logo: z.union([
    z.string().url("Invalid image URL").optional(), // Nếu có URL ảnh
    z
      .instanceof(File)
      .refine((file) => file instanceof File, {
        message: "Image must be a file", // Kiểm tra nếu là file ảnh
      })
      .optional(),
  ]),
  description: z.string().min(5, "Description must be at least 5 characters"),
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
  ownerEmail: z.string().email("Invalid email"),
});
