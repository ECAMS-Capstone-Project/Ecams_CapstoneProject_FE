import ErrorException from "@/components/global/ErrorException";
import ForgotPassword from "@/pages/authentication/forgotPassword";
import Login from "@/pages/authentication/login";
import Register from "@/pages/authentication/register";
import RegisterUniversity from "@/pages/authentication/registerUniversity";
import VerifyCode from "@/pages/authentication/verifyCode";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <ErrorException />
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorException />
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorException />
    },
    {
        path: "/register-university",
        element: <RegisterUniversity />,
        errorElement: <ErrorException />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
        errorElement: <ErrorException />
    },
    {
        path: "/verify-code",
        element: <VerifyCode />,
        errorElement: <ErrorException />
    }
])