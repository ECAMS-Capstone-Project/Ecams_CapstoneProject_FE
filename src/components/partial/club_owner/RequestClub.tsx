import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Grid2,
    styled,
} from "@mui/material";

// 🛠️ Define Schema Validation với Zod
const clubSchema = z.object({
    clubName: z.string().min(3, "Club name must be at least 3 characters"),
    venue: z.string().min(3, "Venue is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    image: z.instanceof(File).optional(),
});

// 🛠️ Define TypeScript Type for Form Data
type ClubFormData = z.infer<typeof clubSchema>;

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const ClubRequestForm: React.FC = () => {
    // 📌 Sử dụng React Hook Form với Zod
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ClubFormData>({
        resolver: zodResolver(clubSchema),
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // 🛠️ Xử lý khi chọn ảnh
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("image", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // 🛠️ Submit Handler
    const onSubmit: SubmitHandler<ClubFormData> = async (data) => {
        console.log("Form Data:", data);
        // TODO: Gọi API tạo club ở đây
    };

    return (
        <Container maxWidth="md" sx={{ p: 4, pt: 1 }}>
            {/* 🔥 Title */}
            <Typography variant="h4" align="center" fontWeight="bold" mt={4}>
                Create Club
            </Typography>

            {/* 📝 Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
                <Grid2 container spacing={2}>
                    {/* 🔹 Club Name */}
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Club Name"
                            {...register("clubName")}
                            error={!!errors.clubName}
                            helperText={errors.clubName?.message}
                        />
                    </Grid2>

                    {/* 🔹 Club Venue */}
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Club Venue"
                            {...register("venue")}
                            error={!!errors.venue}
                            helperText={errors.venue?.message}
                        />
                    </Grid2>

                    {/* 🔹 Start Time & End Time */}
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Start Time"
                            {...register("startTime")}
                            error={!!errors.startTime}
                            helperText={errors.startTime?.message}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="End Time"
                            {...register("endTime")}
                            error={!!errors.endTime}
                            helperText={errors.endTime?.message}
                        />
                    </Grid2>

                    {/* 🔹 Start Date & End Date */}
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            {...register("startDate")}
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="End Date"
                            {...register("endDate")}
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                        />
                    </Grid2>

                    {/* 🔥 Event Description Header */}
                    <Grid2 size={{ xs: 12 }}>
                        <Typography variant="h5" fontWeight="bold" mt={4}>
                            Event Description
                        </Typography>
                    </Grid2>

                    {/* 🔹 Club Image Upload */}
                    <Grid2 size={{ xs: 12 }}>
                        <Typography variant="body1">Club Image (Optional)</Typography>
                        {previewImage && (
                            <Box
                                mt={2}
                                sx={{
                                    width: "100%",
                                    height: 200,
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    backgroundImage: `url(${previewImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                        )}
                    </Grid2>

                    <Grid2 size={{ xs: 12 }}>
                        <Box>
                            <VisuallyHiddenInput
                                accept="image/*"
                                id="upload-button-file"
                                type="file"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="upload-button-file">
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: "none", background: 'linear-gradient(to right, #136CB5, #49BBBD)' }}
                                    component="span"
                                    color="primary"
                                >
                                    Choose
                                </Button>
                            </label>
                        </Box>
                    </Grid2>

                    {/* 🔹 Description */}
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Club Description"
                            multiline
                            rows={4}
                            {...register("description")}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    </Grid2>

                    {/* 🔥 Submit Button */}
                    <Grid2 size={{ xs: 12 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ background: 'linear-gradient(to right, #136CB5, #49BBBD)', color: "white", mt: 2 }}
                        >
                            Create Club
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
        </Container>
    );
};

export default ClubRequestForm;
