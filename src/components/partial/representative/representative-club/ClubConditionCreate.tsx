import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, TextField } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

interface ClubCondition {
    id: number;
    clubId: string;
    conditionType: string;
    conditionValue: string;
    description?: string;
}

const clubConditionSchema = z.object({
    clubId: z.string().min(1, { message: "Club ID is required" }),
    conditionType: z.string().min(1, { message: "Condition Type is required" }),
    conditionValue: z.string().min(1, { message: "Condition Value is required" }),
    description: z.string().optional(),
});

const fakeConditions: ClubCondition[] = [
    { id: 1, clubId: "101", conditionType: "Age", conditionValue: "18+", description: "Only for adults" },
    { id: 2, clubId: "102", conditionType: "Experience", conditionValue: "Beginner", description: "For beginners only" },
    { id: 3, clubId: "103", conditionType: "Membership", conditionValue: "Premium", description: "Only premium members" },
];

const fakeClubIds = ["101", "102", "103", "104", "105"];

export function ClubConditionView() {
    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Club Conditions</CardTitle>
                    <ClubConditionCreate />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fakeConditions.map((c) => (
                            <Card key={c.id} className="p-4 border shadow-md">
                                <div className="text-lg font-semibold">{c.conditionType}</div>
                                <Badge variant="outline" className="mt-2">{c.conditionValue}</Badge>
                                <p className="mt-2 text-sm text-gray-500">{c.description}</p>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function ClubConditionCreate() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ClubCondition>({ resolver: zodResolver(clubConditionSchema) });

    const onSubmit = async (values: ClubCondition) => {
        alert("Club Condition added successfully");
        console.log(values);
        reset();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Club Condition</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Club Condition</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Autocomplete
                            options={fakeClubIds}
                            getOptionLabel={(option) => option} // Đảm bảo hiển thị đúng giá trị
                            renderInput={(params) => (
                                <TextField {...params} label="Club ID" variant="outlined" size="small" />
                            )}
                            onChange={(_, value) => setValue("clubId", value || "")} // Cập nhật giá trị khi chọn
                            disablePortal={true} // Giữ dropdown đúng vị trí
                            defaultValue="" // Tránh lỗi giá trị rỗng
                        />
                        {errors.clubId && <p className="text-red-500 text-sm">{errors.clubId.message as string}</p>}
                    </div>
                    <div>
                        <Input placeholder="Condition Type" {...register("conditionType")} className="h-10" />
                        {errors.conditionType && <p className="text-red-500 text-sm">{errors.conditionType.message as string}</p>}
                    </div>
                    <div>
                        <Input placeholder="Condition Value" {...register("conditionValue")} className="h-10" />
                        {errors.conditionValue && <p className="text-red-500 text-sm">{errors.conditionValue.message as string}</p>}
                    </div>
                    <div>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Description"
                            {...register("description")}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
