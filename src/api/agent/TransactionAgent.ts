/* eslint-disable @typescript-eslint/no-explicit-any */

import { Transaction } from "@/models/Payment";
import {  get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";



export const PaymentList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Transaction>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<Transaction>>>(`http://localhost:5214/api/Transaction?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};