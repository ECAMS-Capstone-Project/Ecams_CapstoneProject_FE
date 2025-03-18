import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { ClubCondition, ClubConditionCreateDTO, CreateClubCondition } from "@/api/club-owner/ClubByUser";
import toast from "react-hot-toast";

const clubConditionSchema = z.object({
    conditionName: z.string().min(1, { message: "Condition Name is required" }),
    conditionContent: z.string().min(1, { message: "Condition Content is required" }),
    description: z.string().min(1, { message: "Description is required" }),
});

interface Props {
    clubId: string;
    setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ClubConditionCreate({ setFlag, clubId }: Props) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ClubCondition>({ resolver: zodResolver(clubConditionSchema) });

    const onSubmit = async (values: ClubCondition) => {
        const data: ClubConditionCreateDTO = {
            clubId: clubId,
            conditionName: values.conditionName,
            conditionContent: values.conditionContent,
            description: values.description,
        };
        await CreateClubCondition(data);
        toast.success("Create successfully");
        setFlag((prev: boolean) => !prev);
        reset();
        setOpen(false); // Đóng dialog sau khi tạo mới thành công
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>Create condition</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Club Condition</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input placeholder="Condition Type" {...register("conditionName")} className="h-10" />
                        {errors.conditionName && <p className="text-red-500 text-sm">{errors.conditionName.message as string}</p>}
                    </div>
                    <div>
                        <Input placeholder="Condition Value" {...register("conditionContent")} className="h-10" />
                        {errors.conditionContent && <p className="text-red-500 text-sm">{errors.conditionContent.message as string}</p>}
                    </div>
                    <div>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Description"
                            {...register("description")}
                            className="w-full p-2 border rounded-md"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message as string}</p>}
                    </div>
                    <div className='flex w-full justify-end'>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
