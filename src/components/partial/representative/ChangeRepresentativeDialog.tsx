import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import useAuth from "@/hooks/useAuth";
import { CreateRequestChangeRepresentativeAPI } from "@/api/representative/RequestChangeRepresentative";
import toast from "react-hot-toast";

const ChangeRepresentativeDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user } = useAuth();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        gender: "MALE" as "MALE" | "FEMALE",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const isEmailValid = (email: string) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async () => {
        const { fullName, email, phoneNumber, address } = form;
        const newErrors: { [key: string]: string } = {};

        if (!fullName) newErrors.fullName = "Full name is required.";
        if (!email) newErrors.email = "Email is required.";
        else if (!isEmailValid(email)) newErrors.email = "Invalid email format.";
        if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";
        if (!address) newErrors.address = "Address is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        if (!user?.universityId) return;

        const payload = {
            universityId: user.universityId,
            representativeInfo: form,
        };

        try {
            await CreateRequestChangeRepresentativeAPI(user.universityId, payload);
            toast.success("Create request successfully")
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Request to Change Representative</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Please enter all required information to propose a new representative for your university.
                    </p>
                    <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <Input
                            name="fullName"
                            placeholder="Enter your full Name"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                        {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <Input
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Phone number</label>
                        <Input
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            value={form.phoneNumber}
                            onChange={handleChange}
                        />
                        {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Address</label>
                        <Input
                            name="address"
                            placeholder="Enter your address"
                            value={form.address}
                            onChange={handleChange}
                        />
                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Gender</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="border rounded-md px-3 py-2 w-full text-sm"
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeRepresentativeDialog;