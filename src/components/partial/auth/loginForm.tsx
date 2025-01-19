/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().nullable(),
});

type userFormValue = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
  const form = useForm<userFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<userFormValue> = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex items-center max-h-screen sm:p-8"></div>
      <div className=" w-full items-center justify-center flex flex-col sm:flex-row overflow-hidden sm:p-8">
        {/* Left Side */}
        <div className="w-full sm:w-1/2 p-24 pt-0 ">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-600 mt-2 opacity-75">
            Login to access your travelwise account
          </p>

          <Form {...form}>
            <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Phone Number Input */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        id="phoneNumber"
                        placeholder="0123456789"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="****************"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <Checkbox {...form.register("rememberMe")} id="rememberMe" />
                  <Label htmlFor="rememberMe" className="ml-2 text-gray-700">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-[#FF8682] hover:underline">
                  Forgot Password
                </a>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-[#136CB5] to-[#49BBBD]"
              >
                Login
              </Button>

              <p className="text-center text-gray-600 mt-4">
                Don't have an account?{" "}
                <a href="#" className="text-[#FF8682] hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </Form>

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
              <Button variant="outline" className="w-1/2 h-12">
                <img
                  src="public/image/facebook-icon.png"
                  alt="Facebook"
                  className="w-6 h-6"
                />
              </Button>
              <Button variant="outline" className="w-1/2 h-12">
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
            src="public/login-img.png"
            alt="Login Illustration"
            className="w-4/5 mb-20"
          />
        </div>
      </div>
    </>
  );
};
export default LoginForm;
