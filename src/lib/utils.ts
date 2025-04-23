import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fixTime(date: Date | string) {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 7);
  return adjustedDate;
}
export function fixTime2(date: Date | string) {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() - 7);
  return adjustedDate;
}

export const combineDateTime = (dateObj: Date, timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Tạo date mới và set giờ phút
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();

  // Tạo date với timezone local
  const newDate = new Date(year, month, date, hours, minutes, 0);

  return newDate;
};
