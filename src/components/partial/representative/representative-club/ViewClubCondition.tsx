/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingAnimation from "@/components/ui/loading";
import { Typography } from "@mui/material";
import {
    ClubCondition,
    GetAllClubCondition,
    DeleteClubCondition,
    UpdateClubCondition,
    ClubConditionUpdateDTO,
} from "@/api/club-owner/ClubByUser";
import ClubConditionCreate from "./ClubConditionCreate";
import { EditClubConditionDialog } from "./EditClubCondtionDialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "./DeleteClubConditionDialog";

interface Props {
    clubId: string;
    isClubOwner: boolean;
}

export function ClubConditionView({ clubId, isClubOwner }: Props) {
    const [clubCondition, setClubCondition] = useState<ClubCondition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [, setError] = useState<string | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<ClubCondition | null>(
        null
    );
    const [flag, setFlag] = useState<boolean>(false);

    // State cho confirm dialog khi xóa
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [deleteConditionId, setDeleteConditionId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!clubId) return;
            setLoading(true);
            try {
                const response = await GetAllClubCondition(clubId);
                setClubCondition(response.data ?? []);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [clubId, flag]);

    // Nếu là club owner thì cho phép mở dialog edit, còn không thì chỉ view
    const handleCardClick = (condition: ClubCondition) => {
        if (isClubOwner) {
            setSelectedCondition(condition);
        }
    };

    const handleCloseDialog = () => {
        setSelectedCondition(null);
    };

    const handleSaveDialog = async (updatedCondition: ClubCondition) => {
        try {
            const data: ClubConditionUpdateDTO = {
                conditionId: updatedCondition.conditionId,
                conditionName: updatedCondition.conditionName,
                conditionContent: updatedCondition.conditionContent,
                description: updatedCondition.description,
            };
            await UpdateClubCondition(data);
            toast.success("Update successfully");
            setFlag(pre => !pre)
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message || "Failed to update condition");
        }
    };

    const triggerDelete = (conditionId: string) => {
        setDeleteConditionId(conditionId);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteConditionId) return;
        try {
            await DeleteClubCondition(deleteConditionId);
            toast.success("Deleted successfully");
            setDeleteConditionId(null);
            setFlag(pre => !pre)
        } catch (err: any) {
            setError(err.message || "Failed to delete condition");
        }
    };

    if (loading) {
        return (
            <div>
                <LoadingAnimation />
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div>
                <div className="flex items-center justify-between">
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        Club Conditions
                    </Typography>
                    {/* Hiển thị nút Create chỉ cho club owner */}
                    {isClubOwner && <ClubConditionCreate setFlag={setFlag} clubId={clubId} />}
                </div>
            </div>
            <Card className="pt-5">
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clubCondition &&
                            clubCondition.map((c) => (
                                <Card
                                    key={c.conditionId}
                                    className="p-4 border shadow-md hover:shadow-lg cursor-pointer duration-200 overflow-hidden rounded-lg transition-transform hover:scale-105"
                                    onClick={isClubOwner ? () => handleCardClick(c) : undefined}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="text-lg font-semibold">
                                            {c.conditionName}
                                        </div>
                                        {/* Nút Delete chỉ hiển thị cho club owner */}
                                        {isClubOwner && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    triggerDelete(c.conditionId);
                                                }}
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="mt-2 ml-0 pl-1 text-justify"
                                    >
                                        {c.conditionContent}
                                    </Badge>
                                    <p className="mt-2 text-sm text-gray-500 text-justify">
                                        {c.description}
                                    </p>
                                </Card>
                            ))}
                        {clubCondition &&
                            clubCondition.length <= 0 && (
                                <div className="text-base text-gray-500 italic flex items-center space-x-2">
                                    <span>📭</span>
                                    <span>No club conditions available.</span>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>

            <EditClubConditionDialog
                open={Boolean(selectedCondition)}
                condition={selectedCondition}
                onClose={handleCloseDialog}
                onSave={handleSaveDialog}
            />

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete Confirmation"
                description="Are you sure you want to delete this condition?"
                onConfirm={confirmDelete}
            />
        </div>
    );
}
