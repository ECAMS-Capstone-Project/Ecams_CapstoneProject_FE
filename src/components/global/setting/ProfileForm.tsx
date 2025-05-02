/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAuthDTOSchema } from "@/schema/UserSchema";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  updatePasswordAPI,
  updateUserInfoAPI,
  UserUpdateDTO,
} from "@/api/auth/LoginAPI";
import { updateAvatarAPI } from "@/api/auth/LoginAPI";

type ProfileFormValues = z.infer<typeof UserAuthDTOSchema>;

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ProfileForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(UserAuthDTOSchema),
    defaultValues: {
      email: user?.email || "",
      fullname: user?.fullname || "",
      phone: user?.phonenumber || "",
      address: user?.address || "",
      gender: user?.gender || "",
      major: user?.major || "",
      year: user?.yearOfStudy,
      startDate: user?.startDate ? new Date(user.startDate) : undefined,
      endDate: user?.endDate ? new Date(user.endDate) : undefined,
    },
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const isRepresentative = user?.roles.includes("REPRESENTATIVE");
  const isStudent = user?.roles.includes("STUDENT");

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      const value: UserUpdateDTO = {
        address: data.address || "",
        endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : "",
        fullname: data.fullname || "",
        gender: data.gender || "",
        major: data.major || "",
        phonenumber: data.phone || "",
        startDate: data.startDate ? format(data.startDate, "yyyy-MM-dd") : "",
        yearOfStudy: data.year || 0,
      };
      if (user?.userId != null || user?.userId != undefined)
        await updateUserInfoAPI(user.userId, value);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.userId) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("ImageFile", file);

        await updateAvatarAPI(user.userId, formData);
        toast.success("Avatar updated successfully");

        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    try {
      setIsLoading2(true);
      console.log(data);
      if (user?.userId != null || user?.userId != undefined)
        await updatePasswordAPI(
          user.userId,
          data.currentPassword,
          data.newPassword
        );
      toast.success("Password changed successfully");
      setIsChangePasswordOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="relative *:text-2xl font-bold">
            <div className="relative">
              <p className="text-center">Profile Settings</p>
            </div>
            <div
              className="absolute left-0 text-end"
              style={{ top: "0px", right: "0" }}
            >
              <Button
                variant={"custom"}
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Change password
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={avatarPreview || user?.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user?.fullname?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    style={{ right: "-30px" }}
                    className="absolute bottom-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="bg-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isRepresentative && (
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="focus:ring-2 focus:ring-primary">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isStudent && (
                  <>
                    <FormField
                      control={form.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Major</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Academic Year
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Year 1</SelectItem>
                              <SelectItem value="2">Year 2</SelectItem>
                              <SelectItem value="3">Year 3</SelectItem>
                              <SelectItem value="4">Year 4</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base">
                            Start Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal focus:ring-2 focus:ring-primary",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base">End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal focus:ring-2 focus:ring-primary",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <Form {...changePasswordForm}>
            <form
              onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <FormField
                control={changePasswordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={changePasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={changePasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsChangePasswordOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading2}>
                  {isLoading2 ? <Loader2 /> : "Change Password"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
