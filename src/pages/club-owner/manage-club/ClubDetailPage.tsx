import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; // Badge từ Shadcn UI
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Globe } from "lucide-react"; // Ví dụ icon
import EventList from "../../../components/partial/club_owner/manage_club/EventList";
import MemberList from "../../../components/partial/club_owner/manage_club/MemberList";
import TaskList from "../../../components/partial/club_owner/manage_club/TaskList";

export default function ClubDetailPage() {
    return (
        <div className="max-w-[1700px] mx-auto p-4">
            {/* ------------- PHẦN HEADER ------------- */}
            <div className="rounded-lg border p-4 mb-4 bg-white shadow-sm">
                {/* Dòng 1: Tiêu đề + Badge Active + menu icon (nếu cần) */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h1 className="text-xl font-bold">
                        Korea - Idol - Kpop - Clubs
                    </h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                    </Badge>
                </div>

                {/* Dòng 2: Mô tả ngắn */}
                <p className="text-gray-700 mt-2">
                    A passion of idol in korea
                </p>

                {/* Dòng 3: Thông tin thêm (ngày, contact, website, v.v...) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3 gap-4">
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>31 days until now</p>
                        <p>Created on 23/07/2023 by Thanh Van</p>
                        <p>Contact: 0123456789</p>
                        <p>Email: Fpt@dev.vn</p>
                        <p>Website URL: https://URL</p>
                    </div>
                    {/* Social icons */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Facebook className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Globe className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Dòng 4: Thông tin tổng quan (Total Members, Total Event, ...) */}
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex flex-col items-center justify-center w-32 rounded-md border p-3 bg-gray-50">
                        <span className="text-2xl font-bold">10</span>
                        <span className="text-xs text-gray-600">Total Members</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-32 rounded-md border p-3 bg-gray-50">
                        <span className="text-2xl font-bold">9</span>
                        <span className="text-xs text-gray-600">Total Event</span>
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
