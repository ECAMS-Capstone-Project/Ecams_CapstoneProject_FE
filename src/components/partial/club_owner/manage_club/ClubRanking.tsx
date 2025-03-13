/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Nếu dùng App Router của Next.js

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Crown, Star } from "lucide-react"; // icon ví dụ

enum ClubStatusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

interface ClubResponseDTO {
    clubId: string;
    clubName: string;
    logoUrl: string;
    description: string;
    purpose: string;
    foundingDate: string;
    contactEmail?: string;
    contactPhone?: string;
    websiteUrl?: string;
    status: ClubStatusEnum;
    clubOwnerId: string;

    // Thêm field để mô phỏng điểm xếp hạng
    activityPoints: number;
}

// ====== FAKE DATA CHO 3 MỐC THỜI GIAN ======
const generateFakeClubs = (count: number, offset = 0): ClubResponseDTO[] => {
    // Sinh ra 1 mảng fake data
    const result: ClubResponseDTO[] = [];
    for (let i = 0; i < count; i++) {
        const rank = offset + i + 1;
        result.push({
            clubId: `${offset + i + 1}`,
            clubName: `CLB #${rank}`,
            logoUrl: "https://picsum.photos/seed/" + (offset + i) + "/200/200",
            description: `Đây là CLB thứ ${rank}, chuyên về ...`,
            purpose: "Giao lưu học hỏi",
            foundingDate: "2022-01-01",
            status: ClubStatusEnum.ACTIVE,
            clubOwnerId: `owner${rank}`,
            activityPoints: 100 - rank, // ví dụ
        });
    }
    return result;
};

const fakeData: Record<string, ClubResponseDTO[]> = {
    "24h": generateFakeClubs(30, 0),
    "7days": generateFakeClubs(30, 30),
    "30days": generateFakeClubs(30, 60),
};

// ====== COMPONENT CHÍNH ======
export default function FancyClubRankingPage() {

    // Tabs: 24h, 7days, 30days
    const [selectedTab, setSelectedTab] = useState<"24h" | "7days" | "30days">("24h");

    // Danh sách clubs full (lấy từ fakeData hoặc API)
    const [allClubs, setAllClubs] = useState<ClubResponseDTO[]>([]);
    // Danh sách clubs hiển thị
    const [displayedClubs, setDisplayedClubs] = useState<ClubResponseDTO[]>([]);
    // Chỉ số phân trang (mỗi lần lấy 10 CLB)
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        // Gọi API thực tế ở đây, tạm thời dùng fakeData
        // fetch(`/api/club-rank?time=${selectedTab}`)
        //   .then(res => res.json())
        //   .then(data => setAllClubs(data));
        const data = fakeData[selectedTab] || [];
        setAllClubs(data);

        // Reset hiển thị khi đổi tab
        setDisplayedClubs(data.slice(0, 10));
        setVisibleCount(10);
    }, [selectedTab]);

    // Load thêm 10 CLB
    const handleLoadMore = () => {
        const nextCount = visibleCount + 10;
        setDisplayedClubs(allClubs.slice(0, nextCount));
        setVisibleCount(nextCount);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-slate-50 to-blue-50 text-gray-900 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Clubs Ranking
                </h1>

                {/* Tabs (shadcn/ui) để chọn khoảng thời gian */}
                <Tabs
                    value={selectedTab}
                    onValueChange={(val) => setSelectedTab(val as any)}
                >
                    <TabsList className="flex justify-center mb-6">
                        <TabsTrigger value="24h">24 Hours</TabsTrigger>
                        <TabsTrigger value="7days">7 Day</TabsTrigger>
                        <TabsTrigger value="30days">30 Day</TabsTrigger>
                    </TabsList>

                    {/* Các TabsContent - ở đây ta chỉ render 1 list (displayedClubs) nên
              ta không cần tách 3 TabsContent riêng nếu không muốn */}
                    <TabsContent value="24h" />
                    <TabsContent value="7days" />
                    <TabsContent value="30days" />

                    {/* Danh sách CLB */}
                    <div className="space-y-4">
                        {displayedClubs.map((club, index) => {
                            const rank = index + 1;
                            // Style đặc biệt cho top 3
                            const isTop1 = rank === 1;
                            const isTop2 = rank === 2;
                            const isTop3 = rank === 3;

                            return (
                                <Card
                                    key={club.clubId}
                                    className="hover:shadow-xl transition-all border border-gray-200"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        {/* Thông tin rank */}
                                        <div className="flex items-center gap-2">
                                            <div className="text-xl font-bold">
                                                #{rank}
                                            </div>
                                            {isTop1 && (
                                                <Crown className="text-yellow-500" size={24} />
                                            )}
                                            {isTop2 && (
                                                <Star className="text-gray-500" size={24} />
                                            )}
                                            {isTop3 && (
                                                <Star className="text-amber-600" size={24} />
                                            )}
                                            <CardTitle>{club.clubName}</CardTitle>
                                        </div>
                                        {/* Logo CLB */}
                                        <img
                                            src={club.logoUrl}
                                            alt={club.clubName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </CardHeader>

                                    <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <CardDescription>{club.description}</CardDescription>
                                            <p className="text-sm text-gray-500">
                                                Hoạt động: {club.activityPoints}
                                            </p>
                                        </div>
                                        {/* Nút xem chi tiết */}
                                        <Button
                                            variant="outline"
                                            className="mt-2 sm:mt-0"
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Nút "Xem thêm" nếu còn CLB */}
                    {visibleCount < allClubs.length && (
                        <div className="flex justify-center mt-6">
                            <Button onClick={handleLoadMore}>Xem thêm</Button>
                        </div>
                    )}
                </Tabs>
            </div>
        </div>
    );
}
