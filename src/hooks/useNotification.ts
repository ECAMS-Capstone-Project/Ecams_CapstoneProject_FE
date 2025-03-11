
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readNoti } from "@/api/agent/NotiAgent";
import {  useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useNotification = () => {
  const queryClient = useQueryClient();

  

   const {mutateAsync: readNotiMutation} = useMutation({
    mutationFn: readNoti,
    onSuccess: () => {
  
      // refetch();
      queryClient.invalidateQueries( {queryKey:["userNoti"]}); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Error read Notification");
    },
  });
  

  return {
    readNotiMutation
  };
};
