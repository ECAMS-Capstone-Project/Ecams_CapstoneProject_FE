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
    clubs: z
      .array(
        z.object({
          ClubId: z.string(),
          IsHost: z.boolean({
            required_error: "You must select a host",
            invalid_type_error: "Invalid value: must be true or false",
          }),
        })
      )
      .optional()
      .refine(
        (clubs) => {
          if (!clubs || clubs.length === 0) return true; // ✅ Không validate nếu không có clubs
          return clubs.some((c) => c.IsHost);
        },
        {
          message: "You must assign a host club",
        }
      )
      .refine(
        (clubs) => {
          if (!clubs || clubs.length === 0) return true; // ✅ Không validate nếu không có clubs
          return clubs.filter((c) => c.IsHost).length === 1;
        },
        {
          message: "Only one host club is allowed",
        }
      ), // Có thể là string hoặc null
    clubName: z.string().optional(), // Có thể là string hoặc null
    eventName: z.string().min(1, { message: "Event name is required" }), // Event name không được rỗng
    startTimeTime: z.string().min(1, "Please select a time"),
    deadlineTime: z.string().min(1, "Please select a time"),
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
    registeredStartDate: z.coerce.date().refine((date) => date !== null, {
      message: "Registered start date is required!",
    }), // Kiểm tra là đối tượng Date hợp lệ
    registeredEndDate: z.coerce.date().refine((date) => date !== null, {
      message: "Registered end date is required!",
    }), // Kiểm tra là đối tượng Date hợp lệ

    // Kiểm tra ngày kết thúc đăng ký phải lớn hơn ngày bắt đầu đăng ký
    fieldIds: z
      .array(z.string())
      .nonempty({ message: "Event field is required" }),
    price: z.coerce.number().min(0, { message: "Price is required" }),
    maxParticipants: z.coerce
      .number()
      .int()
      .positive({ message: "Max participants must be a positive integer" }), // Kiểm tra maxParticipants là số nguyên và dương
    status: z.string().optional(), // Kiểm tra status không rỗng
    walletId: z.string().optional(),
    eventAreas: z.array(
      z.object({
        AreaId: z.string(),
        Date: z.coerce.date(),
        StartTime: z.string(),
        EndTime: z.string(),
      })
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
      .min(1, { message: "Training point must be a positive number" })
      .max(30, { message: "Training point must be less than 30" }),
  })
  .superRefine((data, ctx) => {
    const now = new Date();

    // Check if there is at least one event area
    if (!data.eventAreas || data.eventAreas.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one event area is required",
        path: ["eventAreas", "_error"],
      });
      return;
    }

    const startDateTime = new Date(data.registeredStartDate);
    const [startHour, startMinute] = data.startTimeTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const deadlineDateTime = new Date(data.registeredEndDate);
    const [endHour, endMinute] = data.deadlineTime.split(":").map(Number);
    deadlineDateTime.setHours(endHour, endMinute, 0, 0);

    if (startDateTime < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time must be after now.",
        path: ["startTimeTime"],
      });
    }
    const isSameDate =
      data.registeredStartDate.toDateString() ===
      data.registeredEndDate.toDateString();
    if (isSameDate) {
      const [startHour, startMinute] = data.startTimeTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = data.deadlineTime.split(":").map(Number);

      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "When end time must be after start time.",
          path: ["deadlineTime"],
        });
      }
    }

    // Group areas by date
    const areaGroups = data.eventAreas.reduce((acc, area) => {
      const dateKey = area.Date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(area);
      return acc;
    }, {} as Record<string, typeof data.eventAreas>);

    // Check time overlap for all areas on the same date
    Object.entries(areaGroups).forEach(([, areas]) => {
      // Check all pairs of areas for time overlap
      for (let i = 0; i < areas.length; i++) {
        for (let j = i + 1; j < areas.length; j++) {
          const area1 = areas[i];
          const area2 = areas[j];

          // Convert time strings to minutes
          const start1 = parseInt(area1.StartTime) * 60;
          const end1 = parseInt(area1.EndTime) * 60;
          const start2 = parseInt(area2.StartTime) * 60;
          const end2 = parseInt(area2.EndTime) * 60;

          // Check for time overlap
          if (
            (start1 < end2 && end1 > start2) ||
            (start2 < end1 && end2 > start1)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Time slots overlap between 2 Area`,
              path: ["eventAreas", "_error"],
            });
            return;
          }
        }
      }
    });

    data.eventAreas.forEach((area, index) => {
      const start = parseInt(area.StartTime) * 60;
      const end = parseInt(area.EndTime) * 60;

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time.",
          path: ["eventAreas", index, "EndTime"],
        });
      }
    });
  });

export const InterClubEventSchema = z
  .object({
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
    registeredStartDate: z.coerce.date().refine((date) => date !== null, {
      message: "Registered start date is required!",
    }), // Kiểm tra là đối tượng Date hợp lệ
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
    eventAreas: z.array(
      z.object({
        AreaId: z.string(),
        Date: z.coerce.date(),
        StartTime: z.string(),
        EndTime: z.string(),
      })
    ),

    startTimeTime: z.string().min(1, { message: "Start time is required" }),
    deadlineTime: z.string().min(1, { message: "Deadline time is required" }),

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
  })
  .refine(
    (data) => {
      return data.registeredEndDate >= data.registeredStartDate;
    },
    {
      path: ["registeredEndDate"],
      message: "Registered end date must be after or equal to start date",
    }
  )
  .superRefine((data, ctx) => {
    const now = new Date();

    // Check if there is at least one event area
    if (!data.eventAreas || data.eventAreas.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one event area is required",
        path: ["eventAreas", "_error"],
      });
      return;
    }

    const startDateTime = new Date(data.registeredStartDate);
    const [startHour, startMinute] = data.startTimeTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const deadlineDateTime = new Date(data.registeredEndDate);
    const [endHour, endMinute] = data.deadlineTime.split(":").map(Number);
    deadlineDateTime.setHours(endHour, endMinute, 0, 0);

    if (startDateTime < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time must be after now.",
        path: ["startTimeTime"],
      });
    }
    const isSameDate =
      data.registeredStartDate.toDateString() ===
      data.registeredEndDate.toDateString();
    if (isSameDate) {
      const [startHour, startMinute] = data.startTimeTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = data.deadlineTime.split(":").map(Number);

      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "When end time must be after start time.",
          path: ["deadlineTime"],
        });
      }
    }

    // Group areas by date
    const areaGroups = data.eventAreas.reduce((acc, area) => {
      const dateKey = area.Date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(area);
      return acc;
    }, {} as Record<string, typeof data.eventAreas>);

    // Check time overlap for all areas on the same date
    Object.entries(areaGroups).forEach(([, areas]) => {
      // Check all pairs of areas for time overlap
      for (let i = 0; i < areas.length; i++) {
        for (let j = i + 1; j < areas.length; j++) {
          const area1 = areas[i];
          const area2 = areas[j];

          // Convert time strings to minutes
          const start1 = parseInt(area1.StartTime) * 60;
          const end1 = parseInt(area1.EndTime) * 60;
          const start2 = parseInt(area2.StartTime) * 60;
          const end2 = parseInt(area2.EndTime) * 60;

          // Check for time overlap
          if (
            (start1 < end2 && end1 > start2) ||
            (start2 < end1 && end2 > start1)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Time slots overlap between 2 Area`,
              path: ["eventAreas", "_error"],
            });
            return;
          }
        }
      }
    });

    data.eventAreas.forEach((area, index) => {
      const start = parseInt(area.StartTime) * 60;
      const end = parseInt(area.EndTime) * 60;

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time.",
          path: ["eventAreas", index, "EndTime"],
        });
      }

      if (area.Date <= data.registeredEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Event date must be after registered end date.",
          path: ["eventAreas", index, "Date"],
        });
      }
    });
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
