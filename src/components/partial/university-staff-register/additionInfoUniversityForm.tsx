import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Grid2,
  styled,
  Avatar,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/Constant";
import useAuth from "@/hooks/useAuth";
import { additionInfoUniversityAPI } from "@/api/auth/RegisterAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ring2 } from 'ldrs'
import PoliciesDialog from "../auth/policiesDiablog";

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

// Validation schema using Zod
const schema = z.object({
  UniversityName: z.string().min(1, "University name is required"),
  ShortName: z.string().min(1, "Short name is required"),
  ContactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  ContactEmail: z.string().email("Invalid email address"),
  UniversityAddress: z.string().optional(),
  WebsiteUrl: z.string().min(1, "Website url is required"),
  Logo: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  agreeToTerms: z.boolean().refine((val) => val, "You must agree to the terms"),
});

type SignUpFormValues = z.infer<typeof schema>;

const AdditionInfoUniversityForm: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  ring2.register()
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useAuth()
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
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
    if (user && user.userId) {
      console.log(user.userId);
      const formDataInput = new FormData();
      formDataInput.append("UniversityName", data.UniversityName);
      formDataInput.append("UniversityAddress", data.UniversityAddress || "");
      formDataInput.append("ShortName", data.ShortName);
      formDataInput.append("ContactEmail", data.ContactEmail);
      formDataInput.append("ContactPhone", data.ContactPhone);
      if (data.Logo && data.Logo[0]) {
        formDataInput.append("Logo", data.Logo[0]);
      }
      formDataInput.append("WebsiteUrl", data.WebsiteUrl);
      formDataInput.append("StaffId", user.staffId);

      try {
        console.log(formDataInput.get("StaffId"));
        const response = await additionInfoUniversityAPI(formDataInput);
        if (response) {
          toast.success("Update info successful");
          navigate('/waiting-staff')
        } else {
          toast.error("Update info failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while updating info");
      }
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
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <Grid2 container spacing={6} maxWidth="lg" mb={6} mt={7}>
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
                  {...register("UniversityName")}
                  label="University Name"
                  fullWidth
                  error={!!errors.UniversityName}
                  helperText={errors.UniversityName?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("ShortName")}
                  label="Short Name"
                  fullWidth
                  error={!!errors.ShortName}
                  helperText={errors.ShortName?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("ContactEmail")}
                  label="Contact Email"
                  fullWidth
                  error={!!errors.ContactEmail}
                  helperText={errors.ContactEmail?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("ContactPhone")}
                  label="Contact Phone"
                  fullWidth
                  error={!!errors.ContactPhone}
                  helperText={errors.ContactPhone?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("UniversityAddress")}
                  label="Location"
                  fullWidth
                  error={!!errors.UniversityAddress}
                  helperText={errors.UniversityAddress?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  {...register("WebsiteUrl")}
                  label="Website Url"
                  fullWidth
                  error={!!errors.WebsiteUrl}
                  helperText={errors.WebsiteUrl?.message}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Box>
                  <VisuallyHiddenInput
                    accept="image/*"
                    id="upload-button-file"
                    type="file"
                    {...register("Logo")}
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
                      Choose your logo
                    </Button>
                    {errors.Logo && (
                      <Typography color="error" variant="caption">
                        Please choose image
                      </Typography>
                    )}
                  </label>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                {preview && (
                  <Avatar
                    variant="square"
                    src={preview}
                    alt="Preview"
                    sx={{ width: 100, height: 100 }}
                  />
                )}
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
                  {(isSubmitting) ? "Loading..." : "Submit"}
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Grid2>
      </Grid2>
      <PoliciesDialog open={open} setOpen={setOpen} handleAccept={handleAccept} handleDeny={handleDeny} type='staff' />
    </Box>
  );
};

export default AdditionInfoUniversityForm;
