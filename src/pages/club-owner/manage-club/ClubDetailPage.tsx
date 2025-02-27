import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; // Badge từ Shadcn UI
import EventList from "../../../components/partial/club_owner/manage_club/EventList";
import MemberList from "../../../components/partial/club_owner/manage_club/MemberList";
import TaskList from "../../../components/partial/club_owner/manage_club/TaskList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PopoverClub } from "./PopoverClub";
import { Grid2 } from "@mui/material";

export default function ClubDetailPage() {
    return (
        <div className="max-w-[1700px] mx-auto p-4 pt-0">
            {/* Container chính */}
            <div className="rounded-lg border p-4 mb-4 bg-white shadow-sm">
                {/* Dòng 1: Tiêu đề + Badge Active + Popover menu */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center flex-wrap">
                        <Button onClick={() => history.back()} variant="link" className="mr-2">
                            <ChevronLeft />
                        </Button>
                        <h1 className="text-3xl font-bold mr-4 whitespace-nowrap">
                            Korea - Idol - Kpop - Clubs
                        </h1>
                        <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-md"
                        >
                            Active
                        </Badge>
                    </div>
                    <div>
                        <PopoverClub />
                    </div>
                </div>

                {/* Dòng 2: Layout 2 cột */}
                <Grid2 container spacing={2} mt={5} mb={5}>
                    <Grid2 size={{ xs: 12, md: 9 }}>
                        {/* Cột trái: Avatar + Mô tả */}
                        <div className="flex flex-col md:flex-row items-start md:items-center pl-8">
                            {/* Avatar Club */}
                            <img
                                src="https://i.pravatar.cc/150?img=68" // Fake avatar
                                alt="Club Avatar"
                                className="w-24 h-24 rounded-full object-cover mr-4 mb-2 md:mb-0"
                            />
                            {/* Mô tả */}
                            <p className="text-gray-700 text-base leading-relaxed text-justify">
                                The Drama Club at our school is a vibrant community of students
                                passionate about acting and theater. The club meets every week
                                after school to rehearse for upcoming performances, ranging from
                                classic plays to modern productions. Members collaborate to design
                                sets, create costumes, and learn various acting techniques. The
                                club not only gives students a chance to showcase their talents on
                                stage but also helps them develop confidence, teamwork, and public
                                speaking skills. Every year, the Drama Club organizes a major
                                performance, which is eagerly anticipated by the entire school.
                            </p>
                        </div>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 3 }}>
                        {/* Cột phải: Thông tin thời gian, contact, website */}
                        <div className="flex flex-col md:items-end space-y-1 text-base text-gray-600">
                            <p>
                                <b>Club owner: Thanh Van</b>
                            </p>
                            <p>
                                <b className="text-xl">31</b> days until now
                            </p>
                            <p>
                                Created on 23/07/2023
                            </p>
                            <p>Contact: 0123456789</p>
                            <p>Email: Fpt@dev.vn</p>
                            <p>Website URL: https://URL</p>
                        </div>
                    </Grid2>

                </Grid2>

                {/* Dòng 3: Gạch ngang */}
                <div className="w-full border-t border-gray-300 opacity-50 mt-4 mb-4"></div>

                {/* Dòng 4: Thẻ tổng quan (trái) + Social icons (phải) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Tổng quan (Total Members, Total Event, ...) */}
                    <div className="flex flex-wrap gap-3 pl-2">
                        {/* Box 1 */}
                        <div
                            className="flex flex-col items-center justify-center w-40 h-16 rounded-md border p-3"
                            style={{ background: "linear-gradient(to right, #136CB5, #49BBBD)" }}
                        >
                            <span className="text-sm text-white font-bold">Total Members</span>
                            <span className="text-xl font-bold text-white">10</span>
                        </div>
                        {/* Box 2 */}
                        <div className="flex flex-col items-center justify-center w-40 h-16 rounded-md border p-3 bg-gray-100">
                            <span className="text-sm text-black font-bold">Total Event</span>
                            <span className="text-xl font-bold">9</span>
                        </div>
                    </div>

                    {/* Social icons */}
                    <div className="flex space-x-4">
                        <button className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition duration-300">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1024px-Facebook_f_logo_%282019%29.svg.png"
                                alt="Facebook"
                                className="w-5 h-5"
                            />
                        </button>
                        <button className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition duration-300">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                alt="WhatsApp"
                                className="w-5 h-5"
                            />
                        </button>
                        <button className="bg-blue-800 p-3 rounded-full hover:bg-blue-900 transition duration-300">
                            <img
                                src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000"
                                alt="LinkedIn"
                                className="w-5 h-5"
                            />
                        </button>
                        <button className="bg-gray-400 p-3 rounded-full hover:bg-gray-500 transition duration-300">
                            <img
                                src="https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000"
                                alt="Twitter"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* ------------- PHẦN TABS ------------- */}
            <Tabs defaultValue="events" className="w-full">
                {/* TabsList */}
                <TabsList className="grid w-3/6 grid-cols-3 mb-2">
                    <TabsTrigger value="events">Event List</TabsTrigger>
                    <TabsTrigger value="members">Member List</TabsTrigger>
                    <TabsTrigger value="tasks">Task</TabsTrigger>
                </TabsList>

                {/* Nội dung tab 1 */}
                <TabsContent value="events">
                    <EventList />
                </TabsContent>

                {/* Nội dung tab 2 */}
                <TabsContent value="members">
                    <MemberList />
                </TabsContent>

                {/* Nội dung tab 3 */}
                <TabsContent value="tasks">
                    <TaskList />
                </TabsContent>
            </Tabs>
        </div>
    );
}
