import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid2,
  Stack,
  Avatar,
  styled,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "date-fns";
import useAuth from "@/hooks/useAuth";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/Constant";
import { University } from "@/models/University";
import { UniversityList } from "@/api/agent/UniversityAgent";
import { ring2 } from 'ldrs'
import toast from "react-hot-toast";
import PoliciesDialog from "./policiesDiablog";

// Validation schema using Zod
const schema = z
  .object({
    fullName: z.string().min(1, "First name is required"),
    studentId: z.string().min(1, "Student ID is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
    universityId: z.string().min(1, "University is required"),
    yearStudy: z.string().min(1, "Year of study is required"),
    address: z.string().min(1, "Address is required"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val, "You must agree to the terms"),
    file: z
      .any()
      .refine((files) => {
        return files?.[0]?.size <= MAX_FILE_SIZE;
      }, `Max image size is 5MB.`)
      .refine(
        (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
    major: z.string().min(1, "Major is required"),
    startDate: z.date(),
    endDate: z.date(),
    gender: z.string().min(1, "Gender is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof schema>;

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

const RegisterForm: React.FC = () => {
  ring2.register()
  const [preview, setPreview] = useState<string | null>(null);
  const [date, setDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const { registerStudent } = useAuth();
  const [listUniversity, setListUniversity] = React.useState<University[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);

  useEffect(() => {
    const loadUniversity = async () => {
      try {
        const uniData = await UniversityList(100, 1);

        if (uniData) {
          setListUniversity(uniData.data?.data || []);
        } else {
          console.warn("UniversityList returned no data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadUniversity();
  }, []);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      agreeToTerms: false,
    },
    resolver: zodResolver(schema),
  });
  const agreeToTerms = watch("agreeToTerms");
  const handleAccept = () => {
    setValue("agreeToTerms", true);
    setOpen(false);
  };
  const handleDeny = () => {
    setValue("agreeToTerms", false);
    setOpen(false);
  };
  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("Fullname", data.fullName);
      formData.append("StudentId", data.studentId);
      formData.append("Email", data.email);
      formData.append("PhoneNumber", data.phoneNumber);
      formData.append("Password", data.password);
      formData.append("UniversityId", data.universityId);
      formData.append("YearOfStudy", data.yearStudy);
      formData.append("Address", data.address);
      if (data.file) {
        formData.append("StudentCardImage", data.file[0]);
      }
      formData.append("Major", data.major);
      formData.append("StartDate", data.startDate.toISOString());
      formData.append("EndDate", data.endDate.toISOString());
      formData.append("Gender", data.gender);

      await registerStudent(formData);
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    } else {
      setPreview(null);
    }
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Grid2 container spacing={6} maxWidth="xl" mb={4}>
        {/* Left Side */}
        <Grid2
          size={{ xs: 12, md: 6, sm: 0 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Stack
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              width: "80%",
              maxWidth: "50rem",
            }}
          >
            <img src="public/image/hinhRegister.png"></img>
          </Stack>
        </Grid2>

        {/* Right Side - Form */}
        <Grid2 paddingLeft={6} paddingRight={6} size={{ xs: 12, md: 6 }}>
          <Typography
            color="#313131"
            sx={{ fontWeight: "bold" }}
            variant="h4"
            gutterBottom
          >
            Sign up for student
          </Typography>
          <Typography
            color="#313131"
            sx={{ mb: 2 }}
            variant="subtitle1"
            gutterBottom
          >
            Let’s get you all set up so you can access your personal account.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("fullName")}
                  label="Full Name"
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("studentId")}
                  label="Student ID"
                  fullWidth
                  error={!!errors.studentId}
                  helperText={errors.studentId?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("email")}
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    {...register("gender")}
                    label="Gender"
                    id="demo-simple-select-error"
                  >
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <Typography color="error" variant="caption">
                      {errors.gender.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("phoneNumber")}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("address")}
                  label="Address"
                  fullWidth
                  error={!!errors.studentId}
                  helperText={errors.studentId?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("password")}
                  type="password"
                  label="Password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("confirmPassword")}
                  type="password"
                  label="Confirm Password"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth error={!!errors.universityId}>
                  <InputLabel>University</InputLabel>
                  <Select
                    key={listUniversity.length}
                    {...register("universityId")}
                    label="University"
                    id="demo-simple-select-error"
                  >
                    {listUniversity && listUniversity.map((uni, index) => (
                      <MenuItem key={index + 1} value={uni.universityId}>{uni.universityName}</MenuItem>
                    ))}
                  </Select>
                  {errors.universityId && (
                    <Typography color="error" variant="caption">
                      {errors.universityId.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth error={!!errors.yearStudy}>
                  <InputLabel>Year of study</InputLabel>
                  <Select
                    {...register("yearStudy")}
                    label="Year of study"
                    id="demo-simple-select-error"
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                  </Select>
                  {errors.yearStudy && (
                    <Typography color="error" variant="caption">
                      {errors.yearStudy.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("major")}
                  type="string"
                  label="Major"
                  fullWidth
                  error={!!errors.major}
                  helperText={errors.major?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outlined"
                      sx={{
                        border: "1px solid #E4E4E7",
                        textTransform: "none",
                        color: "#838385",
                      }}
                      className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""
                        }`}
                    >
                      <CalendarIcon />
                      {date ? (
                        formatDate(date, "PPP")
                      ) : (
                        <span className="ml-3">Pick Start Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate || undefined); // Cập nhật giá trị `date` trong state
                        if (selectedDate) {
                          setValue("startDate", selectedDate); // Cập nhật giá trị vào form state
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outlined"
                      sx={{
                        border: "1px solid #E4E4E7",
                        textTransform: "none",
                        color: "#838385",
                      }}
                      className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""
                        }`}
                    >
                      <CalendarIcon />
                      {endDate ? (
                        formatDate(endDate, "PPP")
                      ) : (
                        <span className="ml-3">Pick End Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate || undefined} // Đảm bảo `undefined` được truyền khi `endDate` không có giá trị
                      onSelect={(selectedDate) => {
                        setEndDate(selectedDate || undefined); // Cập nhật giá trị `date` trong state
                        if (selectedDate) {
                          setValue("endDate", selectedDate); // Cập nhật giá trị vào form state
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      disabled={true}
                      sx={{
                        "&.Mui-disabled": {
                          color: "#1565C0",
                        }
                      }}
                      checked={agreeToTerms}
                    />
                  }
                  label={
                    <Typography onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
                      I agree to all the terms and{" "}
                      <span
                        className="text-red-400"
                        style={{ cursor: "pointer" }}
                      >
                        Privacy Policies
                      </span>
                    </Typography>
                  }
                />
                {errors.agreeToTerms && (
                  <Typography color="error" variant="caption">
                    {errors.agreeToTerms.message}
                  </Typography>
                )}
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Box>
                  <VisuallyHiddenInput
                    accept="image/*"
                    id="upload-button-file"
                    type="file"
                    {...register("file")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleFileChange(e);
                    }}
                  />
                  <label htmlFor="upload-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      color="primary"
                    >
                      Choose student card
                    </Button>
                    {errors.file && (
                      <Typography color="error" variant="caption">
                        {/* {errors.file?.message} */}
                      </Typography>
                    )}
                  </label>
                </Box>
              </Grid2>

              {/* Preview Avatar */}
              <Grid2 size={{ xs: 12 }}>
                {preview && (
                  <Avatar
                    src={preview}
                    variant="square"
                    alt="Preview"
                    sx={{ width: 100, height: 100 }}
                  />
                )}
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Button
                  sx={{
                    background: "linear-gradient(to right, #136CB5, #49BBBD)",
                    textTransform: "none",
                  }}
                  type="submit"
                  variant="contained"
                  fullWidth
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
                >
                  {(isSubmitting) ? "Loading..." : "Create account"}
                </Button>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Typography align="center">
                  Already have an account?{" "}
                  <Link className="text-red-400" to="/login">
                    Login
                  </Link>
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <div className="relative my-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 opacity-50"></div>
                  </div>
                  <div className="relative bg-white px-4 text-gray-600 opacity-50">
                    Or login with
                  </div>
                </div>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <div className="flex justify-center mt-4 gap-4">
                  <Button variant="outlined" className="w-1/2 h-12">
                    <img
                      src="public/image/facebook-icon.png"
                      alt="Facebook"
                      className="w-6 h-6"
                    />
                  </Button>
                  <Button variant="outlined" className="w-1/2 h-12">
                    <img
                      src="public/image/google-icon.png"
                      alt="Google"
                      className="w-6 h-6"
                    />
                  </Button>
                </div>
              </Grid2>
            </Grid2>
          </form>
        </Grid2>
      </Grid2>
      <PoliciesDialog open={open} setOpen={setOpen} handleAccept={handleAccept} handleDeny={handleDeny} type='student' />
    </Box>
  );
};

export default RegisterForm;
