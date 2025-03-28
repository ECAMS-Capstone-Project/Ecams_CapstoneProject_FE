import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Edit3, Mail, Phone, School } from "lucide-react";
import ChangeRepresentativeDialog from "@/components/partial/representative/ChangeRepresentativeDialog";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

// Fake current representative data
const currentRep = {
    id: "rep1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "123-456-7890",
};

const RepresentativeInformationPage: React.FC = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleSubmitChangeRequest = (data: {
        candidateName: string;
        candidateEmail: string;
    }) => {
        // Here you would call an API to create the change request.
        console.log("Change request submitted:", data);
        setOpenDialog(false);
    };

    return (
        <div className="mx-auto p-4">
            <div className="flex items-center justify-between pt-4">
                <Heading
                    title={`Representative Information`}
                    description={`View information about the current representative assigned for the club.`}
                />
            </div>
            <Separator />
            <div className="max-w-4xl mx-auto p-7 mt-7">
                <Card className="overflow-hidden shadow-lg rounded-xl">
                    <CardHeader className="flex items-center space-x-4 bg-gradient-to-br from-[#197dd4] to-[#49BBBD] p-4 mb-6">
                        <Users size={24} className="ml-3 text-white" />
                        <CardTitle className="text-white text-lg">{currentRep.name} - Representative</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border border-gray-200 rounded-md mb-5">
                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                <Users size={16} className="text-gray-500" />
                                Representative Info
                            </h3>
                            <div className="space-y-2">
                                <p className="flex items-center space-x-2">
                                    <Mail size={16} className="text-gray-500" />
                                    <span>
                                        <strong>Email:</strong> {currentRep.email}
                                    </span>
                                </p>
                                <p className="flex items-center space-x-2 mt-2">
                                    <Phone size={16} className="text-gray-500" />
                                    <span>
                                        <strong>Phone:</strong> {currentRep.phone}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    This is your current representative assigned for the club.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-md">
                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                <School size={16} className="text-gray-500" />
                                Belong to University
                            </h3>
                            <div className="space-y-2">
                                <p className="flex items-center space-x-2">
                                    <strong className="mr-2">University Name:</strong> {'FPT University'}
                                </p>
                                <p className="flex items-center space-x-2">
                                    <strong className="mr-2">University Email:</strong> {'fpt-education.edu.vn'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    This is the university associated with the club.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={() => setOpenDialog(true)}>
                            <Edit3 size={16} className="mr-2" />
                            Change Representative
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            {openDialog && (
                <ChangeRepresentativeDialog
                    onClose={() => setOpenDialog(false)}
                    onSubmit={handleSubmitChangeRequest}
                />
            )}
        </div>
    );
};

export default RepresentativeInformationPage;
