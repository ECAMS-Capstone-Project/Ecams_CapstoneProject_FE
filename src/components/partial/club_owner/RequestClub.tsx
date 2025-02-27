import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Grid,
    Avatar,
    Autocomplete,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CreateFieldsAPI, FieldDTO, GetAllFields, RequestClubAPI } from "@/api/club-owner/RequestClubAPI";
import toast from "react-hot-toast";
import { StatusCodeEnum } from "@/lib/statusCodeEnum";
import useAuth from "@/hooks/useAuth";
import { ring2 } from "ldrs";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Zod Schema for validation
const clubSchema = z.object({
    clubName: z.string().min(3, "Club name must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    purpose: z.string().min(5, "Purpose must be at least 5 characters"),
    logo: z.instanceof(File).optional(),
    fieldIds: z.array(z.string()).min(1, "At least one field is required"),
    members: z.array(
        z.object({
            email: z.string().email("Invalid email"),
        })
    ).min(1, "At least one member is required"),
});

type ClubFormData = z.infer<typeof clubSchema>;

const ClubRequestForm: React.FC = () => {
    ring2.register()
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ClubFormData>({
        resolver: zodResolver(clubSchema),
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [fieldOptions, setFieldOptions] = useState<FieldDTO[]>([]);
    const [, setLoadingFields] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false); // State to open the dialog
    const [fieldInput, setFieldInput] = useState(""); // Input field for creating new field
    const [members, setMembers] = useState<{ email: string }[]>([]);
    const [emailInput, setEmailInput] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleFieldInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.value.trim() == null || e.target.value.trim() == "") {
            toast.error("Please input field name")
            return;
        }
        setFieldInput(e.target.value.trim())
    }

    useEffect(() => {
        const fetchFields = async () => {
            setLoadingFields(true);
            try {
                const response = await GetAllFields();
                setFieldOptions(response.data || []);
            } catch (error) {
                console.error("Failed to fetch fields", error);
            } finally {
                setLoadingFields(false);
            }
        };
        fetchFields();
    }, []);

    // -------------------
    // Upload Logo
    // -------------------
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("logo", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // -------------------
    // Thêm Member
    // -------------------
    const handleAddMember = () => {
        if (emailInput.trim() && !members.some((m) => m.email === emailInput)) {
            const newMember = { email: emailInput };
            const updated = [...members, newMember];
            setMembers(updated);
            setValue("members", updated);
            setEmailInput("");
        }
    };

    // -------------------
    // Tạo Field mới
    // -------------------
    const handleCreateField = async (newFieldName: string) => {
        if (newFieldName.trim() == "" || newFieldName.trim() == null) {
            toast.error("Please input field name")
            return;
        }
        // Kiểm tra field đã tồn tại chưa
        const isFieldExist = fieldOptions.some(f => f.fieldName === newFieldName);
        if (isFieldExist) return; // Nếu đã có thì không tạo lại
        console.log(errors);

        try {
            const response = await CreateFieldsAPI(newFieldName);
            if (response.statusCode === StatusCodeEnum.CREATED) {
                toast.success("Field created successfully");
                const newField = response.data; // Lấy thông tin field mới
                const newField2: FieldDTO = {
                    fieldId: newField || "",
                    fieldName: newFieldName
                }
                setFieldOptions((prev) => [...prev, newField2]); // Thêm vào danh sách field options
                setOpenDialog(false); // Đóng dialog sau khi tạo
            }
        } catch (error) {
            console.error("Failed to create field", error);
        }
    };

    // -------------------
    // Submit Handler
    // -------------------
    const onSubmit: SubmitHandler<ClubFormData> = async (data) => {
        if (user) {
            const formData = new FormData();
            formData.append("UserId", user.userId);
            formData.append("ClubName", data.clubName);
            formData.append("Description", data.description);
            formData.append("Purpose", data.purpose);

            if (data.logo) {
                formData.append("Logo", data.logo);
            }

            data.fieldIds.forEach((id) => formData.append("FieldIds", id));

            // Lưu member
            data.members.forEach((member, index) => {
                formData.append(`Members[${index}].Email`, member.email);
            });

            try {
                const response = await RequestClubAPI(formData)
                if (response.statusCode == StatusCodeEnum.CREATED) {
                    toast.success("Request successfully")
                    navigate('/club')
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };
    const isMobile = useMediaQuery("(max-width:600px)");
    return (
        <div >
            <Container maxWidth="md" sx={{ display: "flex" }}>
                <div className="relative" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: "40px", paddingTop: "10px" }}>
                    <div className="absolute" style={{ top: "29px" }}>
                        {isMobile ? (
                            <Button
                                onClick={() => window.history.back()}
                                sx={{
                                    minWidth: "40px",
                                    height: "40px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "50%",
                                    "@media (max-width: 600px)": {
                                        left: "-20px",
                                        top: "-3px",
                                    },
                                }}
                            >
                                <ChevronLeft />
                            </Button>
                        ) : (
                            <Button sx={{ color: "black" }} onClick={() => window.history.back()}><ChevronLeft />back</Button>
                        )
                        }
                    </div>
                    <Typography variant="h4" align="center" fontWeight="bold" mt={2} color="primary">
                        Create Club
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
                        <Grid container spacing={3}>
                            {/* Club Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Club Name"
                                    {...register("clubName")}
                                    error={!!errors.clubName}
                                    helperText={errors.clubName?.message}
                                />
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    {...register("description")}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            </Grid>

                            {/* Purpose */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Purpose"
                                    multiline
                                    rows={2}
                                    {...register("purpose")}
                                    error={!!errors.purpose}
                                    helperText={errors.purpose?.message}
                                />
                            </Grid>

                            {/* Multiple Select Fields */}
                            <Grid item xs={12}>
                                <Controller
                                    name="fieldIds"
                                    control={control}
                                    render={({ field }) => {
                                        const currentValue = fieldOptions?.filter((fo) =>
                                            field.value?.includes(fo.fieldId)
                                        );
                                        return (
                                            <Autocomplete
                                                multiple
                                                options={fieldOptions}
                                                getOptionLabel={(option) =>
                                                    typeof option === "string" ? option : option.fieldName
                                                }
                                                isOptionEqualToValue={(option, val) => option.fieldId === val.fieldId}
                                                value={currentValue}
                                                onChange={(_, newVal) => {
                                                    const finalIds: string[] = [];
                                                    newVal.forEach((item) => {
                                                        finalIds.push(item.fieldId);
                                                    });
                                                    field.onChange(finalIds);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Fields"
                                                        placeholder="Search and select"
                                                        error={!!errors.fieldIds}
                                                        helperText={errors.fieldIds?.message}
                                                    />
                                                )}
                                            />
                                        );
                                    }}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => setOpenDialog(true)}
                                        sx={{ mt: 2, textTransform: "none" }}
                                    >
                                        Add More Field
                                    </Button>
                                </div>
                            </Grid>

                            {/* Member Emails */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Add Member (Email)"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddMember();
                                        }
                                    }}
                                    error={!!errors.members}
                                    helperText={errors.members?.message}
                                />
                            </Grid>

                            {/* Display Added Members */}
                            <Grid item xs={12} display="flex" flexWrap="wrap" gap={1}>
                                {members.map((m, index) => (
                                    <Chip
                                        key={index}
                                        label={m.email}
                                        onDelete={() => {
                                            const updated = members.filter((mm) => mm.email !== m.email);
                                            setMembers(updated);
                                            setValue("members", updated);
                                        }}
                                    />
                                ))}
                            </Grid>
                            {/* Upload Logo */}
                            <Grid item xs={12} mb={3}>
                                {previewImage && (
                                    <Avatar
                                        src={previewImage}
                                        variant="rounded"
                                        sx={{ width: 120, height: 120, mt: 2, mb: 2 }}
                                    />
                                )}
                                <input accept="image/*" type="file" onChange={handleImageUpload} hidden id="upload-logo" />
                                <label htmlFor="upload-logo">
                                    <Button
                                        component="span"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mt: 1, textTransform: "none" }}
                                    >
                                        Choose Logo
                                    </Button>
                                </label>
                            </Grid>
                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <div className="flex justify-center">
                                    <Button type="submit"
                                        sx={{
                                            background: "linear-gradient(to right, #136CB5, #49BBBD)",
                                            textTransform: "none",
                                            width: "70%"
                                        }}
                                        disabled={isSubmitting}
                                        startIcon={
                                            isSubmitting && (
                                                <l-ring-2
                                                    size="40"
                                                    stroke="5"
                                                    stroke-length="0.25"
                                                    bg-opacity="0.1"
                                                    speed="0.8"
                                                    color="black"
                                                ></l-ring-2>
                                            )
                                        }
                                        variant="contained">
                                        {(isSubmitting) ? "Loading..." : "Create account"}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Dialog for creating new field */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Create New Field</DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="Field Name"
                                value={fieldInput}
                                onChange={handleFieldInput}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button onClick={() => { handleCreateField(fieldInput); }}>Add</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Container>
        </div>
    );
};

export default ClubRequestForm;
