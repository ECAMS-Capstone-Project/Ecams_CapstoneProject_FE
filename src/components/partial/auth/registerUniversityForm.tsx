import React from "react";
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
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { RepresentativeRegisterRequest } from "@/models/Auth/RepresentativeRegister";
import { GenderEnum } from "@/lib/GenderEnum";
import { ring2 } from 'ldrs'
import PoliciesDialog from "./policiesDiablog";
// Validation schema using Zod
const schema = z
  .object({
    fullName: z.string().min(1, "First name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
    address: z.string().min(1, "Address is required"),
    gender: z.string().min(1, "Gender is required"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof schema>;

const RegisterUniversityForm: React.FC = () => {
  ring2.register()
  const [open, setOpen] = React.useState<boolean>(false);
  const { registerUniversity } = useAuth();
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
    const user: RepresentativeRegisterRequest = {
      fullname: data.fullName,
      email: data.email,
      gender: data.gender as GenderEnum,
      address: data.address,
      phonenumber: data.phoneNumber,
      password: data.password,
    };
    await registerUniversity(user);
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
            Sign up for university
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
                  {...register("phoneNumber")}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("email")}
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 12 }}>
                <TextField
                  {...register("address")}
                  label="Address"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
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

              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    {...register("gender")}
                    label="Gender"
                    id="demo-simple-select-error"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <Typography color="error" variant="caption">
                      {errors.gender.message}
                    </Typography>
                  )}
                </FormControl>
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
      <PoliciesDialog open={open} setOpen={setOpen} handleAccept={handleAccept} handleDeny={handleDeny} type='staff' />
    </Box>
  );
};

export default RegisterUniversityForm;
