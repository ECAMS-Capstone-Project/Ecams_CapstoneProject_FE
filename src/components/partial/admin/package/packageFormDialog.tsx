/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { editPackageSchema } from "@/schema/PackageSchema";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
// import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { packageType } from "@/models/Status";
import { createPackage } from "@/api/agent/PackageAgent";
import DialogLoading from "@/components/ui/dialog-loading";
import { useState } from "react";

type EditPackageFormValues = z.infer<typeof editPackageSchema>;

interface EditPackageDialogProps {
  initialData: EditPackageFormValues | null;
}

export const EditPackageDialog: React.FC<EditPackageDialogProps> = ({
  initialData,
}) => {
  const form = useForm<EditPackageFormValues>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: initialData || {
      packageName: "",
      // createdBy: "",
      // updatedBy: null,
      price: 0,
      status: true,
      duration: 0,
      description: "",
      packageDetails: [
        {
          packageType: "",
          value: "",
        },
      ],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setOpen] = useState(false);
  // const [open, setOpen] = useState(false)
  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "packageDetails",
  });

  async function onSubmit(values: EditPackageFormValues) {
    try {
      setIsLoading(true);
      console.log("Adding New Package:", values);
      await createPackage(values);
      toast.success("Package created successfully.");
      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className=" min-h-[200px] sm:min-h-[300px] h-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "View Package Details" : "Add New Package"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData
              ? "View the package details below."
              : "Fill out the form below to add a new package."}
          </DialogDescription>
          <div>
            <div className="p-4">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Package Name */}
                    <FormField
                      control={control}
                      name="packageName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price */}
                    <FormField
                      control={control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Description */}

                    {/* Duration */}
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (Months)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              value={
                                field.value == true ? "Active" : "Inactive"
                              }
                              // onChange={(e) => field.onChange(e.target.value)}
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="border p-2 rounded w-full h-20"
                              readOnly={!!initialData}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Package Details */}
                  <div className="col-span-2">
                    <FormLabel>Package Details</FormLabel>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-3 mb-3 mt-2"
                      >
                        {/* Package Type */}
                        <FormField
                          control={control}
                          name={`packageDetails.${index}.packageType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {/* <Input
                          {...field}
                          placeholder="Package Type (e.g., students, events)"
                          readOnly={!!initialData}
                        /> */}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={`w-[200px] justify-between ${
                                        initialData ? "pointer-events-none" : ""
                                      }`}
                                    >
                                      {field.value
                                        ? packageType.find(
                                            (type) => type.value === field.value
                                          )?.label
                                        : "Select Package Type..."}
                                      <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                      <CommandInput placeholder="Search type..." />
                                      <CommandList>
                                        <CommandEmpty>
                                          No types found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {packageType.map((type) => (
                                            <CommandItem
                                              key={type.value}
                                              onSelect={() => {
                                                const isDuplicate = fields.some(
                                                  (existingField, idx) =>
                                                    existingField.packageType ===
                                                      type.value &&
                                                    idx !== index // Exclude the current index
                                                );

                                                if (isDuplicate) {
                                                  toast.error(
                                                    "This package type has already been selected."
                                                  );
                                                  return;
                                                }

                                                field.onChange(type.value);
                                              }}
                                            >
                                              {type.label}
                                              <Check
                                                className={`ml-auto ${
                                                  field.value === type.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                }`}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Value */}
                        <FormField
                          control={control}
                          name={`packageDetails.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Value"
                                  readOnly={!!initialData}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          disabled={!!initialData}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}

                    {/* Add New Detail */}
                    <Button
                      type="button"
                      onClick={() => append({ packageType: "", value: "" })}
                      disabled={!!initialData}
                    >
                      Add Detail
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <div className="flex w-full justify-end mt-4 ">
                    {!initialData ? (
                      <Button type="submit">Add Package</Button>
                    ) : (
                      <DialogClose>
                        <Button type="button">Quit</Button>
                      </DialogClose>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
