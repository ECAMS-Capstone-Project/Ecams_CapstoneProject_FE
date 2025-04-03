/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GetHistoryChangeRepresentativeAPI, GetRepresentativeHistoryDTO, RepresentativeChangeInfo } from "@/api/representative/RequestChangeRepresentative";
import { Heading } from "@/components/ui/heading";
import toast from "react-hot-toast";

const UniversityRepresentativeHistory: React.FC = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<GetRepresentativeHistoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchName, setSearchName] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRep, setSelectedRep] = useState<GetRepresentativeHistoryDTO | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [flag, setFlag] = useState<boolean>(false);
    const [formEdit, setFormEdit] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        gender: "MALE" as "MALE" | "FEMALE",
    });

    useEffect(() => {
        const debouncedSearch = _.debounce(() => {
            setSearchName(searchInput);
        }, 600);
        debouncedSearch();
        return () => debouncedSearch.cancel();
    }, [searchInput]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                RepresentativeName: searchName,
                FromDate: fromDate,
                ToDate: toDate,
                PageNumber: pageNumber.toString(),
                PageSize: pageSize.toString(),
            });
            if (!user?.universityId) return;
            const response = await GetHistoryChangeRepresentativeAPI(user.universityId, params)
            setHistory(response.data?.data || []);
            setTotalPages(response.data?.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch representative history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.universityId) {
            fetchHistory();
        }
    }, [user?.universityId, searchName, fromDate, toDate, pageNumber, pageSize, flag]);

    const displayDate = (dateStr: string | null) => {
        if (!dateStr || new Date(dateStr).getFullYear() === 1) return "Not yet";
        return format(new Date(dateStr), "dd/MM/yyyy");
    };

    const handleDelete = async () => {
        if (!user?.universityId) return;
        await RepresentativeChangeInfo(user.universityId || "", {
            type: "DELETE",
            updateInfo: {
                fullName: "",
                email: "",
                phoneNumber: "",
                address: "",
                gender: "MALE",
            }
        });
        toast.success("Delete information successfully")
        setFlag(pre => !pre)
        setSelectedRep(null);
        setIsDeleting(false);
    };

    const handleUpdate = async () => {
        if (!user?.universityId) return;
        await RepresentativeChangeInfo(user.universityId, { type: "UPDATE", updateInfo: formEdit });
        toast.success("Update information successfully")
        setFlag(pre => !pre)
        setSelectedRep(null);
        setIsEditing(false);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormEdit((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <div className="text-gray-800 flex items-center justify-between bg-white rounded-lg shadow-lg w-full p-5 mb-5">
                <Heading
                    title={`Representative Change Requests`}
                    description={`View and edit representative change requests.`}
                />
            </div>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <Input placeholder="Search by name" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <input className="p-2 text-sm" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    <input className="p-2 text-sm" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    <Button onClick={() => setPageNumber(1)}>Apply Filters</Button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="text-center text-gray-500">No representative history found.</p>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 gap-6">
                            {history.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).map((rep) => (
                                <Card key={rep.userId} className="shadow-md hover:shadow-lg transition duration-300 border border-gray-200 rounded-xl">
                                    <CardHeader className="flex items-center gap-4">
                                        <img
                                            src={rep.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${rep.fullname}`}
                                            alt={rep.fullname}
                                            className="w-14 h-14 rounded-full object-cover border"
                                        />
                                        <div>
                                            <CardTitle className="text-lg text-center font-semibold text-gray-800">{rep.fullname}</CardTitle>
                                            <p className="text-sm text-gray-600">{rep.email}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-sm text-gray-700 space-y-1 pt-1">
                                        <div className="flex justify-between"><span className="font-medium">Phone:</span><span>{rep.phoneNumber}</span></div>
                                        <div className="flex justify-between"><span className="font-medium">Start Date:</span><span>{displayDate(rep.startDate)}</span></div>
                                        <div className="flex justify-between"><span className="font-medium">End Date:</span><span>{displayDate(rep.endDate)}</span></div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Status:</span>
                                            <span className={
                                                rep.status === "PENDING" ? "text-yellow-500"
                                                    : rep.status === "ACTIVE" ? "text-green-600"
                                                        : "text-red-500"
                                            }>
                                                {rep.status}
                                            </span>
                                        </div>
                                        <div className="pt-2 mt-2 text-right">
                                            <Button size="sm" variant="custom" onClick={() => {
                                                setSelectedRep(rep);
                                                setFormEdit({
                                                    fullName: rep.fullname,
                                                    email: rep.email,
                                                    phoneNumber: rep.phoneNumber,
                                                    gender: rep.gender,
                                                    address: "string"
                                                });
                                            }}>
                                                View Detail
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button variant="outline" onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))} disabled={pageNumber === 1}>Previous</Button>
                            <span>Page {pageNumber} of {totalPages}</span>
                            <Button variant="outline" onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))} disabled={pageNumber === totalPages}>Next</Button>
                        </div>
                    </>
                )}

                {selectedRep && (
                    <Dialog open={true} onOpenChange={() => { setSelectedRep(null); setIsEditing(false); }}>
                        <DialogContent className="max-w-lg">
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-center text-2xl font-bold">Representative Detail</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={selectedRep.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${selectedRep.fullname}`}
                                    alt={selectedRep.fullname}
                                    className="w-24 h-24 rounded-full object-cover border shadow"
                                />
                                <div className="w-full text-sm text-gray-700 space-y-2">
                                    {isEditing ? (
                                        <>
                                            <Input name="fullName" value={formEdit.fullName} onChange={handleEditChange} placeholder="Full Name" />
                                            <Input name="email" value={formEdit.email} onChange={handleEditChange} placeholder="Email" />
                                            <Input name="phoneNumber" value={formEdit.phoneNumber} onChange={handleEditChange} placeholder="Phone Number" />
                                            <select name="gender" value={formEdit.gender} onChange={handleEditChange} className="border rounded-md px-3 py-2 w-full">
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between"><span className="font-medium">Full Name:</span><span>{selectedRep.fullname}</span></div>
                                            <div className="flex justify-between"><span className="font-medium">Email:</span><span>{selectedRep.email}</span></div>
                                            <div className="flex justify-between"><span className="font-medium">Phone:</span><span>{selectedRep.phoneNumber}</span></div>
                                            <div className="flex justify-between"><span className="font-medium">Gender:</span><span>{selectedRep.gender}</span></div>
                                            <div className="flex justify-between"><span className="font-medium">Start Date:</span><span>{displayDate(selectedRep.startDate)}</span></div>
                                            <div className="flex justify-between"><span className="font-medium">End Date:</span><span>{displayDate(selectedRep.endDate)}</span></div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Status:</span>
                                                <span className={
                                                    selectedRep.status === "PENDING" ? "text-yellow-500"
                                                        : selectedRep.status === "ACTIVE" ? "text-green-600"
                                                            : "text-red-500"
                                                }>
                                                    {selectedRep.status}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {selectedRep.status === "PENDING" && (
                                <DialogFooter className="flex justify-end mt-4 gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button onClick={handleUpdate}>Save</Button>
                                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        </>
                                    ) : isDeleting ? (
                                        <>
                                            <Button onClick={handleDelete}>Save</Button>
                                            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="destructive" onClick={() => setIsDeleting(true)}>Delete Request</Button>
                                            <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                        </>
                                    )}
                                </DialogFooter>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>

    );
};

export default UniversityRepresentativeHistory;
