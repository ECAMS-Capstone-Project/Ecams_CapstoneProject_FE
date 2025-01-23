import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Grid2,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validation schema using Zod
const schema = z.object({
  universityName: z.string().min(1, "University name is required"),
  shortName: z.string().min(1, "Short name is required"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  contactEmail: z.string().email("Invalid email address"),
  location: z.string().min(1, "Address is required"),
  websiteUrl: z.string().min(1, "Website url is required"),
  logoLink: z.string().min(1, "Logo link is required"),
  agreeToTerms: z.boolean().refine((val) => val, "You must agree to the terms"),
});

type SignUpFormValues = z.infer<typeof schema>;

const AdditionInfoUniversityForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    console.log(data);
    // const user: StaffRegisterRequest = {
    //   universityName: data.fullName,
    //   shortName: data.email,
    //   contactEmail: data.email,
    //   contactPhone: data.address,
    //   location: data.phoneNumber,
    //   websiteUrl: data.password,
    //   logoLink: data.address,
    // };
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <Grid2 container spacing={6} maxWidth="lg" mb={6}>
        <Typography
          textAlign={"center"}
          color="#313131"
          sx={{ fontWeight: "bold" }}
          variant="h4"
          gutterBottom
        >
          Welcome to our platform! Please provide your university information so
          you can register and start using our services
        </Typography>
      </Grid2>
      <Grid2 container spacing={6} maxWidth="md" mb={4}>
        <Grid2 paddingLeft={6} paddingRight={6} size={{ xs: 12 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("universityName")}
                  label="University Name"
                  fullWidth
                  error={!!errors.universityName}
                  helperText={errors.universityName?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("shortName")}
                  label="Short Name"
                  fullWidth
                  error={!!errors.shortName}
                  helperText={errors.shortName?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("contactEmail")}
                  label="Contact Email"
                  fullWidth
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("contactPhone")}
                  label="Contact Phone"
                  fullWidth
                  error={!!errors.contactPhone}
                  helperText={errors.contactPhone?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("location")}
                  label="Location"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("websiteUrl")}
                  label="Website Url"
                  fullWidth
                  error={!!errors.websiteUrl}
                  helperText={errors.websiteUrl?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("logoLink")}
                  label="Logo Link"
                  fullWidth
                  error={!!errors.logoLink}
                  helperText={errors.logoLink?.message}
                />
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
                <Button
                  sx={{
                    background: "linear-gradient(to right, #136CB5, #49BBBD)",
                    textTransform: "none",
                  }}
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AdditionInfoUniversityForm;
