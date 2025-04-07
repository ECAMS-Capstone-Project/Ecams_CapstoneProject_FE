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
import { Grid2 } from "@mui/material";

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
        email: "",
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
                email: "",
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
                                <Card key={rep.userId} className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-2xl p-4 bg-white">
                                    <CardHeader className="flex items-center gap-5">
                                        <img
                                            src={rep.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${rep.fullname}`}
                                            alt={rep.fullname}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                                        />
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-800 text-center">{rep.fullname}</CardTitle>
                                            <p className="text-md text-gray-600">{rep.email}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-base text-gray-700 space-y-2 pt-2">
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={6}>
                                                <div className="flex gap-2"><span className="font-semibold">Phone:</span><span>{rep.phoneNumber}</span></div>
                                            </Grid2>
                                            <Grid2 size={6}>
                                                <div className="flex justify-end gap-2"><span className="font-semibold">Start Date:</span><span>{displayDate(rep.startDate)}</span></div>
                                            </Grid2>
                                        </Grid2>
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={6}>
                                                <div className="flex gap-2"><span className="font-semibold">End Date:</span><span>{displayDate(rep.endDate)}</span></div>
                                            </Grid2>
                                            <Grid2 size={6}>
                                                <div className="flex justify-end gap-2">
                                                    <span className="font-semibold">Status:</span>
                                                    <span className={
                                                        rep.status === "PENDING" ? "text-yellow-600 font-semibold"
                                                            : rep.status === "ACTIVE" ? "text-green-600 font-semibold"
                                                                : "text-red-500 font-semibold"
                                                    }>
                                                        {rep.status}
                                                    </span>
                                                </div>
                                            </Grid2>
                                        </Grid2>
                                        <div className="pt-3 text-right">
                                            <Button size="sm" variant="custom" className="px-4 py-1 text-sm font-medium" onClick={() => {
                                                setSelectedRep(rep);
                                                setFormEdit({ email: rep.email });
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
                            <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-white to-slate-100 p-6 rounded-xl shadow-md">
                                <div className="relative">
                                    <img
                                        src={
                                            selectedRep.avatar ||
                                            `https://api.dicebear.com/6.x/initials/svg?seed=${selectedRep.fullname}`
                                        }
                                        alt={selectedRep.fullname}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                </div>

                                <div className="w-full text-base text-gray-800 space-y-3">
                                    {isEditing ? (
                                        <Input
                                            name="email"
                                            value={formEdit.email}
                                            onChange={handleEditChange}
                                            placeholder="Email"
                                            className="text-base p-3 rounded-lg border-gray-300 shadow-sm"
                                        />
                                    ) : (
                                        <>
                                            {[
                                                ["Full Name", selectedRep.fullname],
                                                ["Email", selectedRep.email],
                                                ["Phone", selectedRep.phoneNumber],
                                                ["Gender", selectedRep.gender],
                                                ["Start Date", displayDate(selectedRep.startDate)],
                                                ["End Date", displayDate(selectedRep.endDate)],
                                            ].map(([label, value]) => (
                                                <div className="flex justify-between items-center" key={label}>
                                                    <span className="font-semibold text-gray-600">{label}:</span>
                                                    <span className="text-right font-medium">{value}</span>
                                                </div>
                                            ))}

                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-600">Status:</span>
                                                <span
                                                    className={`text-right font-semibold ${selectedRep.status === "PENDING"
                                                        ? "text-yellow-500"
                                                        : selectedRep.status === "ACTIVE"
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                        }`}
                                                >
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
