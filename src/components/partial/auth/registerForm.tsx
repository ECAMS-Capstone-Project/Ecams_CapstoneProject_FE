import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
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
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Validation schema using Zod
const schema = z
  .object({
    fullName: z.string().min(1, "First name is required"),
    studentId: z.string().min(1, "Student ID is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
    university: z.string().min(1, "University is required"),
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
  const [preview, setPreview] = useState<string | null>(null);
  const [date, setDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
    alert("Account created successfully!");
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
        <Grid2 size={{ xs: 12, md: 6 }}>
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
                <FormControl fullWidth error={!!errors.major}>
                  <InputLabel>Major</InputLabel>
                  <Select
                    {...register("major")}
                    label="Major"
                    id="demo-simple-select-error"
                  >
                    <MenuItem value="Male">Software Engineer</MenuItem>
                    <MenuItem value="Female">Marketing</MenuItem>
                    <MenuItem value="Other C">Other</MenuItem>
                  </Select>
                  {errors.major && (
                    <Typography color="error" variant="caption">
                      {errors.major.message}
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
                <FormControl fullWidth error={!!errors.university}>
                  <InputLabel>University</InputLabel>
                  <Select
                    {...register("university")}
                    label="University"
                    id="demo-simple-select-error"
                  >
                    <MenuItem value="University A">University A</MenuItem>
                    <MenuItem value="University B">University B</MenuItem>
                    <MenuItem value="University C">University C</MenuItem>
                  </Select>
                  {errors.university && (
                    <Typography color="error" variant="caption">
                      {errors.university.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("yearStudy")}
                  type="number"
                  label="Year Of Study"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth error={!!errors.university}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    {...register("university")}
                    label="Gender"
                    id="demo-simple-select-error"
                  >
                    <MenuItem value="University A">Male</MenuItem>
                    <MenuItem value="University B">Female</MenuItem>
                    <MenuItem value="University C">Other</MenuItem>
                  </Select>
                  {errors.university && (
                    <Typography color="error" variant="caption">
                      {errors.university.message}
                    </Typography>
                  )}
                </FormControl>
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
                      className={`w-full justify-start text-left font-normal ${
                        !date ? "text-muted-foreground" : ""
                      }`}
                    >
                      <CalendarIcon />
                      {date ? (
                        formatDate(date, "PPP")
                      ) : (
                        <span>Pick Start Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      {...register("startDate")}
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
                      className={`w-full justify-start text-left font-normal ${
                        !date ? "text-muted-foreground" : ""
                      }`}
                    >
                      <CalendarIcon />
                      {endDate ? (
                        formatDate(endDate, "PPP")
                      ) : (
                        <span>Pick End Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      {...register("endDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox {...register("agreeToTerms")} color="primary" />
                  }
                  label={
                    <Typography>
                      I agree to all the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policies
                      </a>
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
                      Choose File
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
                >
                  Create account
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
    </Box>
  );
};

export default RegisterForm;
