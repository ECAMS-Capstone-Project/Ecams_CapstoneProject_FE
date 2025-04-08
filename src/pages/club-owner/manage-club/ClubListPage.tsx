/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClubResponseDTO,
  GetAllClubsAPI,
  GetProcessClubsAPI,
} from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import DialogLoading from "@/components/ui/dialog-loading";
import PageNavigation from "@/components/global/PageNavigation";
import { useNavigate } from "react-router-dom";
import { ClubListSection } from "./ClubListSection";
import InviteClubCard from "@/components/partial/club_owner/manage_club/InviteClubCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InviteClubDialog } from "@/components/partial/club_owner/manage_club/InviteClubDialog";

const ClubListPage: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "PENDING" | "PROCESSING">(
    "ACTIVE"
  ); // Trạng thái mặc định

  const [clubsCache, setClubsCache] = useState<{
    [key: string]: { [page: number]: ClubResponseDTO[] };
  }>({
    ACTIVE: {},
    INACTIVE: {},
    PENDING: {},
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [clubDetail, setClubDetail] = useState<ClubResponseDTO>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClubs = async () => {
      if (!user) return;

      // ✅ Đảm bảo cache tồn tại cho status đó
      if (!clubsCache[status]) {
        setClubsCache((prev) => ({
          ...prev,
          [status]: {},
        }));
      }

      // ✅ Kiểm tra nếu đã có trong cache
      if (clubsCache[status]?.[page]) return;

      setLoading(true);
      try {
        let response;

        if (status === "PROCESSING") {
          if (!user.universityId) {
            throw new Error("University ID is undefined");
          }
          response = await GetProcessClubsAPI(user.universityId, page);
        } else {
          response = await GetAllClubsAPI(user.userId, status, page);
        }

        setClubsCache((prev) => ({
          ...prev,
          [status]: {
            ...(prev[status] || {}),
            [page]: response.data?.data || [],
          },
        }));
        setTotalPages(response.data?.totalPages || 1);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, [user, status, page]);


  const clubs = (clubsCache?.[status]?.[page]) || []; // Lấy dữ liệu theo `status` + `page`
  const handleCreateClub = () => {
    navigate("/club/create-club");
  };
  const handleClick = (club: ClubResponseDTO) => {
    setClubDetail(club);
    setOpenDialog(true);
  }

  return (
    <>
      <Tabs
        defaultValue="ACTIVE"
        value={status}
        onValueChange={(val) => {
          setStatus(val as "ACTIVE" | "INACTIVE" | "PENDING" | "PROCESSING");
          setPage(1);
        }}
        className="w-full p-2"
      >
        <Box sx={{ marginBottom: "20px", padding: "0 16px" }}>
          <Grid2 container alignItems="center" spacing={2}>
            <Grid2 size={{ xs: 12, sm: 8 }}>
              <TabsList>
                <TabsTrigger value="ACTIVE">Participated</TabsTrigger>
                <TabsTrigger value="INACTIVE">History</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="PROCESSING">Processing</TabsTrigger>
              </TabsList>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 4 }} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #136CB5, #49BBBD)",
                  textTransform: "none",
                  // ...
                }}
                onClick={handleCreateClub}
              >
                Create Club
              </Button>
            </Grid2>
          </Grid2>
        </Box>

        {/* Danh sách Clubs */}
        <TabsContent value="ACTIVE">
          <ClubListSection status={status} clubs={clubs} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="INACTIVE">
          <ClubListSection status={status} clubs={clubs} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="PENDING">
          <Box sx={{ padding: 4, paddingTop: 0 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              <Box component="span" sx={{ color: "#136CB5", fontWeight: 700 }}>
                Clubs
              </Box>{" "}
              pending
            </Typography>

            {loading ? (
              <DialogLoading />
            ) : error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : clubs.length > 0 ? (
              <Grid2 container spacing={3}>
                {clubs.map((club, index) => (
                  <Grid2
                    key={index}
                    size={{ xs: 12, sm: 6, md: 3 }}
                    display="flex"
                    justifyContent="center"
                    onClick={() => handleClick(club)}
                  >
                    <InviteClubCard image={club.logoUrl} title={club.clubName} field={club.clubFields} />
                  </Grid2>
                ))}
              </Grid2>
            ) : <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={6}
              px={2}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGPZuTNVvXmIRxRNnuPa5wAqQvyawEG-96fw&s"
                alt="No clubs"
                style={{ width: 100, height: 100, opacity: 0.85, marginBottom: 16 }}
              />
              <Typography variant="h6" fontWeight={600} color="textSecondary" gutterBottom>
                No clubs found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your filters or come back later to explore more student clubs 💡
              </Typography>
            </Box>
            }
          </Box>
        </TabsContent>

        <TabsContent value="PROCESSING">
          <Box sx={{ padding: 4, paddingTop: 0 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              <Box component="span" sx={{ color: "#136CB5", fontWeight: 700 }}>
                Clubs
              </Box>{" "}
              awaiting approval
            </Typography>

            {loading ? (
              <DialogLoading />
            ) : error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : clubs.length > 0 ? (
              <Grid2 container spacing={3}>
                {clubs.map((club, index) => (
                  <Grid2
                    key={index}
                    size={{ xs: 12, sm: 6, md: 3 }}
                    display="flex"
                    justifyContent="center"
                    onClick={() => handleClick(club)}
                  >
                    <InviteClubCard image={club.logoUrl} title={club.clubName} field={club.clubFields} />
                  </Grid2>
                ))}
              </Grid2>
            ) : <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={6}
              px={2}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGPZuTNVvXmIRxRNnuPa5wAqQvyawEG-96fw&s"
                alt="No clubs"
                style={{ width: 100, height: 100, opacity: 0.85, marginBottom: 16 }}
              />
              <Typography variant="h6" fontWeight={600} color="textSecondary" gutterBottom>
                No clubs found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your filters or come back later to explore more student clubs 💡
              </Typography>
            </Box>
            }
          </Box>
        </TabsContent>

        {clubs.length > 0 && (
          <div style={{ position: "relative", minHeight: "80px" }}>
            <ul
              style={{
                marginTop: "28px",
                marginBottom: "10px",
                position: "absolute",
                left: "50%",
                transform: "translate(-50%)",
              }}
            >
              <PageNavigation
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </ul>
          </div>
        )}
      </Tabs>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <InviteClubDialog
            initialData={clubDetail as any}
            mode={"view"}
            setOpenDialog={setOpenDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClubListPage;
