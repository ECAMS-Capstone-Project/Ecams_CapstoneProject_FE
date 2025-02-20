import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; // Badge từ Shadcn UI
import EventList from "../../../components/partial/club_owner/manage_club/EventList";
import MemberList from "../../../components/partial/club_owner/manage_club/MemberList";
import TaskList from "../../../components/partial/club_owner/manage_club/TaskList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PopoverClub } from "./PopoverClub";

export default function ClubDetailPage() {
    return (
        <div className="max-w-[1700px] mx-auto p-4 pt-0">
            {/* ------------- PHẦN HEADER ------------- */}
            <div className="rounded-lg border p-4 mb-4 bg-white shadow-sm">
                {/* Dòng 1: Tiêu đề + Badge Active + menu icon (nếu cần) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-normal flex-wrap ">
                        <Button variant={'link'} >
                            <ChevronLeft />
                        </Button>
                        <h1 className="text-4xl font-bold mr-5">
                            Korea - Idol - Kpop - Clubs
                        </h1>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                        </Badge>
                    </div>
                    <div>
                        <PopoverClub />
                    </div>
                </div>

                {/* Dòng 2: Mô tả ngắn */}
                <p className="text-gray-700 text-xl mt-2">
                    A passion of idol in korea
                </p>

                <div className="w-full border-t border-gray-300 opacity-50 mt-3 mb-5"></div>

                {/* Dòng 3: Thông tin thêm (ngày, contact, website, v.v...) */}
                <div className=" flex-col md:flex-row md:items-center md:justify-between mt-3 gap-4">
                    <div className="text-base text-gray-600 space-y-1">
                        <p><b className="text-xl">31</b> days until now</p>
                        <p>Created on 23/07/2023 by <b>Thanh Van</b></p>
                        <p>Contact: 0123456789</p>
                        <p>Email: Fpt@dev.vn</p>
                        <p>Website URL: https://URL</p>
                    </div>
                    {/* Social icons */}
                    <div className="flex space-x-4 mt-6 mb-2">
                        <button className="bg-blue-600 p-4 rounded-full hover:bg-blue-700 transition duration-300">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1024px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" className="w-8 h-8" />
                        </button>
                        <button className="bg-green-600 p-4 rounded-full hover:bg-green-700 transition duration-300">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
                        </button>
                        <button className="bg-blue-800 p-4 rounded-full hover:bg-blue-900 transition duration-300">
                            <img src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000" alt="LinkedIn" className="w-8 h-8" />
                        </button>
                        <button className="bg-gray-400 p-4 rounded-full hover:bg-gray-500 transition duration-300">
                            <img src="https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000" alt="Twitter" className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                {/* Dòng 4: Thông tin tổng quan (Total Members, Total Event, ...) */}
                <div className="flex flex-wrap gap-1 mt-6">
                    <div className="flex text-white flex-col items-center justify-center w-44 h-20 rounded-md border p-3 bg-gray-50" style={{ background: "linear-gradient(to right, #136CB5, #49BBBD)" }}>
                        <span className="text-sm mb-1 text-white font-bold">Total Members</span>
                        <span className="text-2xl font-bold">10</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-44 h-20 rounded-md border p-3 bg-gray-50" style={{ background: "#F1F1F1" }}>
                        <span className="text-sm mb-1 text-black font-bold">Total Event</span>
                        <span className="text-2xl font-bold">9</span>
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
