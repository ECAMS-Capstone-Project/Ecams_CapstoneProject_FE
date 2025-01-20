/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Link, FormControl } from '@mui/material';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

type userFormValue = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
  const { handleSubmit, register, formState: { errors } } = useForm<userFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<userFormValue> = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex items-center max-h-screen sm:p-8"></div>
      <div className="w-full items-center justify-center flex flex-col sm:flex-row overflow-hidden sm:p-8">
        {/* Left Side */}
        <div className="w-full sm:w-1/2 p-24 pt-0 ">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-600 mt-2 opacity-75">
            Login to access your travelwise account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            {/* Email Input */}
            <FormControl fullWidth margin="normal" error={!!errors.email}>
              <TextField
                id="email"
                label="Email"
                {...register('email')}
                autoComplete="email"
                variant="outlined"
                placeholder="guest@email.com"
                error={!!errors.email}
                helperText={errors.email?.message}

              />
            </FormControl>

            {/* Password Input */}
            <FormControl fullWidth margin="normal" error={!!errors.password}>
              <TextField
                id="outlined-password-input"
                label="Password"
                placeholder="*********"
                type="password"
                {...register('password')}
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
              />
            </FormControl>

            {/* Forgot Password */}
            <div className="flex items-center justify-end mt-4">
              <Link href="#" variant="body2" sx={{ color: '#FF8682', textDecoration: 'none' }}>
                Forgot Password
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                background: 'linear-gradient(to right, #136CB5, #49BBBD)',
                textTransform: "none"
              }}
            >
              Login
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link href="#" sx={{ color: '#FF8682', textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </form>

          {/* Or login with */}
          <div className="mt-8 text-center">
            <div className="relative my-8 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 opacity-50"></div>
              </div>
              <div className="relative bg-white px-4 text-gray-600 opacity-50">
                Or login with
              </div>
            </div>
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
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden sm:flex w-full sm:w-1/2 items-center justify-center">
          <img
            src="/public/login-img.png"
            alt="Login Illustration"
            className="w-4/5 md:w-3/4 lg:w-1/2 xl:w-2/3 mb-20"
          />
        </div>

      </div>
    </>
  );
};
export default LoginForm;
