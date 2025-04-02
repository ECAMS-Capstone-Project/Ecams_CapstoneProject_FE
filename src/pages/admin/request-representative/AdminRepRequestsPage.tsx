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
// import { get } from "@/lib/api";

const ITEMS_PER_PAGE = 4;

const AdminRepRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<RepChangeRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RepChangeRequest | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");

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
    }, [search, statusFilter, currentPage]);

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
        console.log("Admin approved:", selectedRequest.universityId);
        await AcceptRepresentativeRequestAPI(selectedRequest.universityId)
        toast.success("Approve successfully")
        handleCloseDialog();
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
                            className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                            gradientColor="#D1EAF0"
                        >
                            <Card className="shadow w-full">
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <School size={24} className="text-blue-500" />
                                        <CardTitle>{req.universityName}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm">
                                    <p className="flex items-center gap-2"><ShieldCheck size={14} /> Status: {req.status}</p>
                                    <p className="flex items-center gap-2"><Mail size={14} /> Email: {req.contactEmail}</p>
                                    <p className="flex items-center gap-2"><Phone size={14} /> Phone: {req.contactPhone}</p>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button onClick={() => handleReview(req)}>
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
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl w-full max-w-lg p-6">
                        <h3 className="text-2xl font-extrabold text-blue-700 mb-4 text-center">🎓 Review Request</h3>
                        <div className="space-y-3 text-sm text-gray-800">
                            <div className="text-center">
                                <img src={selectedRequest.logoLink} alt="Logo" className="h-16 mx-auto mb-2" />
                                <h4 className="font-bold text-lg flex items-center justify-center gap-2"><School size={16} /> {selectedRequest.universityName}</h4>
                                <p className="text-gray-600">{selectedRequest.universityAddress}</p>
                            </div>
                            <div className="mt-4">
                                <strong className="flex items-center gap-2 text-blue-600"><UserCircle2 size={16} /> Requester Info:</strong>
                                <p>👤 {selectedRequest.requesterInfo.fullname}</p>
                                <p>📧 {selectedRequest.requesterInfo.email}</p>
                                <p>📞 {selectedRequest.requesterInfo.phoneNumber}</p>
                            </div>
                            <div className="mt-2">
                                <strong className="flex items-center gap-2 text-green-600"><UserCheck size={16} /> Requested Replacement:</strong>
                                <p>👤 {selectedRequest.requestedPersonInfo.fullname}</p>
                                <p>📧 {selectedRequest.requestedPersonInfo.email}</p>
                                <p>📞 {selectedRequest.requestedPersonInfo.phoneNumber}</p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <Button variant="outline" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitDecision} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Submit Approval
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRepRequestsPage;
