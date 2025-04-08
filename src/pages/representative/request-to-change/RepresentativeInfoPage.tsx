import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Edit3, Mail, Phone, School, CheckCircle, Info, ShieldCheck, University } from "lucide-react";
import ChangeRepresentativeDialog from "@/components/partial/representative/ChangeRepresentativeDialog";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";
import { Box, Chip, Avatar } from "@mui/material";

const RepresentativeInformationPage: React.FC = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const { user } = useAuth();

    return (
        <div className="bg-gradient-to-br from-slate-50 to-white p-6">
            <div className="flex items-center justify-between pt-4">
                <Heading
                    title={`Representative Information`}
                    description={`View and manage details of the current club representative.`}
                />
            </div>

            <Separator className="my-6" />

            <div className="max-w-4xl mx-auto" style={{ marginTop: "60px" }}>
                <Card className="overflow-hidden rounded-xl shadow-md">
                    <CardHeader className="bg-gradient-to-r from-[#136CB5] to-[#49BBBD] p-6 text-white rounded-t-xl">
                        <div className="flex items-center gap-4">
                            <Avatar src={user?.avatar} alt={user?.fullname} />
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    {user?.fullname} <span className="font-medium">– Representative</span>
                                </CardTitle>
                                <Chip
                                    label="Representative"
                                    size="small"
                                    sx={{ mt: 1, backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-6 sm:grid-cols-2 mt-8">
                        <Box className="p-4 border border-gray-200 rounded-md shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Users size={18} className="text-[#197dd4]" />
                                Representative Info
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p className="flex items-center gap-2 mt-3 mb-3">
                                    <Mail size={16} className="text-gray-500" />
                                    <span><strong>Email:</strong> {user?.email}</span>
                                </p>
                                <p className="flex items-center gap-2 mt-3 mb-3">
                                    <Phone size={16} className="text-gray-500" />
                                    <span><strong>Phone:</strong> {user?.phonenumber}</span>
                                </p>
                                <p className="flex items-center gap-2 mt-3 mb-3">
                                    <ShieldCheck size={16} className="text-gray-500" />
                                    <span><strong>Verified:</strong> {user?.isVerified ? "Yes" : "No"}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1 mt-3 mb-3">
                                    This information is associated with your current role.
                                </p>
                            </div>
                        </Box>

                        <Box className="p-4 border border-gray-200 rounded-md shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <School size={18} className="text-[#197dd4]" />
                                University Info
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p className="flex items-center gap-2 mt-3">
                                    <University size={16} className="text-gray-500" />
                                    <span><strong>University Name:</strong> {user?.universityName}</span>
                                </p>
                                <p className="flex items-center gap-2 mt-3">
                                    <Info size={16} className="text-gray-500" />
                                    <span><strong>University Role:</strong> {user?.roles.join(", ")}</span>
                                </p>
                                <p className="flex items-center gap-2 mt-3 mb-3">
                                    <CheckCircle size={16} className="text-gray-500" />
                                    <span><strong>University Status:</strong> {user?.universityStatus}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-3 mb-3">
                                    This is the university you're currently assigned to.
                                </p>
                            </div>
                        </Box>
                    </CardContent>

                    <CardFooter className="flex justify-end px-6 pb-6 pt-2 mb-2">
                        <Button
                            onClick={() => setOpenDialog(true)}
                            variant="outline"
                            className="text-[#136CB5] font-semibold hover:bg-blue-50"
                        >
                            <Edit3 size={16} className="mr-2" />
                            Change Representative
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {openDialog && (
                <ChangeRepresentativeDialog onClose={() => setOpenDialog(false)} />
            )}
        </div>
    );
};

export default RepresentativeInformationPage;