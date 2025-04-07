import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@mui/material';
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import LoginFormFields from "./LoginFormFields";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

type userFormValue = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
  const { login } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<userFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<userFormValue> = async (data) => {
    try {
      await login(data);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-gray-600 mb-6">Access your account to continue</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <LoginFormFields register={register} errors={errors} />

          <div className="flex items-center justify-end mt-4">
            <Link
              to="/forgot-password"
              style={{ color: '#FF8682', textDecoration: 'none' }}
            >
              Forgot Password
            </Link>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 3,
              textTransform: "none"
            }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link
              to="/choose-register"
              style={{ color: '#FF8682', textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
