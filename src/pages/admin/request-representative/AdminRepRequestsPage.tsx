/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { Edit3, Mail, Phone, School, ShieldCheck, UserCheck, UserCircle2, Search } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AcceptRepresentativeRequestAPI, GetAllRequestByRepresentativeAPI, RepChangeRequest } from "@/api/admin/RequestRepresentative";
import toast from "react-hot-toast";
import LoadingAnimation from "@/components/ui/loading";

const ITEMS_PER_PAGE = 4;

const AdminRepRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<RepChangeRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RepChangeRequest | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [flag, setFlag] = useState(false);
    useEffect(() => {
        async function fetchRequests() {
            try {
                setLoading(true);
                const response = await GetAllRequestByRepresentativeAPI(search, statusFilter, currentPage, ITEMS_PER_PAGE)
                setRequests(response.data?.data || []);
            } catch (err: any) {
                setError(err.message || "Error fetching requests");
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, [search, statusFilter, currentPage, flag]);

    const filteredRequests = requests.filter((r) => {
        return (
            (!search || r.universityName.toLowerCase().includes(search.toLowerCase())) &&
            (!statusFilter || statusFilter === "ALL" || r.status === statusFilter)
        );
    });

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
    const currentRequests = filteredRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleReview = (req: RepChangeRequest) => {
        setSelectedRequest(req);
    };

    const handleCloseDialog = () => {
        setSelectedRequest(null);
    };

    const handleSubmitDecision = async () => {
        if (!selectedRequest) return;
        setIsSubmitting(true);
        try {
            await AcceptRepresentativeRequestAPI(selectedRequest.universityId);
            toast.success("Approve successfully");
            handleCloseDialog();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
            setFlag(pre => !pre)
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between bg-white rounded-lg shadow-lg w-full p-3 mb-5">
                <Heading
                    title={`University Representative Change Requests`}
                    description={`View and approve representative change requests.`}
                />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Search size={16} />
                    <Input
                        placeholder="Search by university name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6 mt-6">
                {loading ? (
                    <p className="text-center col-span-2">Loading requests...</p>
                ) : error ? (
                    <p className="text-center text-red-500 col-span-2">Error: {error}</p>
                ) : filteredRequests.length === 0 ? (
                    <p className="text-center col-span-2">No matching requests found.</p>
                ) : (
                    currentRequests.map((req) => (
                        <MagicCard
                            key={req.universityId}
                            className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-2xl shadow-xl transition-transform hover:scale-[1.03] bg-gradient-to-br from-blue-100 to-cyan-100"
                            gradientColor="#D1EAF0"
                        >
                            <Card className="w-full rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                                <CardHeader className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white rounded-t-2xl py-4 px-5">
                                    <div className="flex items-center space-x-3">
                                        <School size={24} />
                                        <CardTitle className="text-xl font-bold">{req.universityName}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-base text-gray-700 p-5">
                                    <p className="flex items-center gap-3">
                                        <Mail size={16} className="text-blue-500" />
                                        <span className="font-medium">Email:</span> {req.contactEmail}
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <Phone size={16} className="text-blue-500" />
                                        <span className="font-medium">Phone:</span> {req.contactPhone}
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <ShieldCheck size={16} className="text-blue-500" />
                                        <span className="font-medium">Status:</span>
                                        <span
                                            className={
                                                req.status === "PENDING"
                                                    ? "text-yellow-600 font-semibold"
                                                    : req.status === "ACTIVE"
                                                        ? "text-green-600 font-semibold"
                                                        : "text-red-500 font-semibold"
                                            }
                                        >
                                            {req.status}
                                        </span>
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-end p-4 bg-gray-50 rounded-b-2xl">
                                    <Button onClick={() => handleReview(req)} variant={'default'} className="text-white px-4 py-2 rounded-md text-sm font-semibold">
                                        <Edit3 size={16} className="mr-2" /> View
                                    </Button>
                                </CardFooter>
                            </Card>
                        </MagicCard>

                    ))
                )}
            </div>

            {filteredRequests.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-lg p-8">
                        <h3 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
                            🎓 Review Request
                        </h3>

                        <div className="space-y-5 text-[16px] text-gray-800">
                            <div className="text-center">
                                <img
                                    src={selectedRequest.logoLink}
                                    alt="Logo"
                                    className="h-20 mx-auto mb-3"
                                />
                                <h4 className="font-bold text-xl flex items-center justify-center gap-2 text-blue-800">
                                    <School size={18} /> {selectedRequest.universityName}
                                </h4>
                                <p className="text-gray-600 text-base">{selectedRequest.universityAddress}</p>
                            </div>

                            <div className="mt-4">
                                <strong className="flex items-center gap-2 text-blue-600 text-lg">
                                    <UserCircle2 size={18} /> Requester Info:
                                </strong>
                                <p>👤 <strong>{selectedRequest.requesterInfo.fullname}</strong></p>
                                <p>📧 {selectedRequest.requesterInfo.email}</p>
                                <p>📞 {selectedRequest.requesterInfo.phoneNumber}</p>
                            </div>

                            <div className="mt-3">
                                <strong className="flex items-center gap-2 text-green-600 text-lg">
                                    <UserCheck size={18} /> Requested Replacement:
                                </strong>
                                <p>👤 <strong>{selectedRequest.requestedPersonInfo.fullname}</strong></p>
                                <p>📧 {selectedRequest.requestedPersonInfo.email}</p>
                                <p>📞 {selectedRequest.requestedPersonInfo.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <Button variant="outline" onClick={handleCloseDialog} className="px-5 py-2 text-base">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitDecision}
                                disabled={isSubmitting}
                                variant={"default"}
                                className="hover:bg-black text-white px-5 py-2 text-base"
                            >
                                {isSubmitting ? <LoadingAnimation /> : "Submit Approval"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRepRequestsPage;
