import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@mui/material";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Dữ liệu mô phỏng (thêm 'id' để điều hướng)
const events = [
    {
        id: 1,
        name: "Linux",
        version: "LIN v2.0",
        duration: "4 days (12 hours)",
        date: "23/07/2022",
        author: "Johny Deep",
        isActive: true,
    },
    {
        id: 2,
        name: "Linux",
        version: "LIN v2.0",
        duration: "4 days (12 hours)",
        date: "23/07/2022",
        author: "Johny Deep",
        isActive: true,
    },
    {
        id: 3,
        name: "AWS Basic",
        version: "AWB v1.0",
        duration: "7 days (21 hours)",
        date: "23/07/2022",
        author: "Warrior Tran",
        isActive: true,
    },
    {
        id: 4,
        name: "AWS Basic",
        version: "AWB v1.0",
        duration: "7 days (21 hours)",
        date: "23/07/2022",
        author: "Warrior Tran",
        isActive: true,
    },
];

export default function EventList() {
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Lọc sự kiện dựa trên tên hoặc mô tả
    const filteredEvents = events.filter((evt) =>
        evt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="flex flex-col gap-4 mt-4 max-h-[420px] overflow-y-auto">
            <div className="mt-2 mb-2 ml-2">
                <Input
                    placeholder="Search events..."
                    type="email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-2/6 "
                />
            </div>
            {filteredEvents.map((evt) => (
                <Link
                    key={evt.id}
                    to={`/events/${evt.id}`}
                    className="flex items-center gap-4 rounded-lg bg-white shadow-sm border
                     hover:shadow-md transition cursor-pointer no-underline"
                    style={{ height: "105px", borderRadius: "20px" }}
                >
                    <div
                        className="w-32 h-full flex justify-center items-center"
                        style={{
                            background: "linear-gradient(to right, #136CB5, #49BBBD)",
                            borderTopLeftRadius: "20px",
                            borderBottomLeftRadius: "20px",
                        }}
                    >
                        <Avatar />
                    </div>

                    <div className="flex flex-col py-2 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-semibold">{evt.name}</span>
                            {evt.isActive && (
                                <Badge variant="outline" className="border-green-600 text-green-600">
                                    Active
                                </Badge>
                            )}
                        </div>

                        <span className="text-sm text-gray-600">
                            {evt.version} / {evt.duration} on {evt.date} by {evt.author}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
