/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

// Lazy loading các component
const PendingUniversityList = React.lazy(
  () =>
    import(
      "@/components/partial/admin/admin-dashboard/pending-request/PendingRequest"
    )
);
const ReportList = React.lazy(
  () => import("@/components/partial/admin/admin-dashboard/report/Report")
);

import { UniversityList } from "@/api/agent/UniversityAgent";
// import { getReportList } from "@/api/agent/ReportAgent";
import { University } from "@/models/University";
import { Report } from "@/models/Report";
import LoadingAnimation from "@/components/ui/loading";
import { getReportList } from "@/api/agent/ReportAgent";
import {
  GetStatisticSystem,
  StatisticSystemResponse,
} from "@/api/admin/Statistic";
import { formatPrice } from "@/lib/FormatPrice";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [universityList, setUniversityList] = useState<University[]>([]);
  const [reportList, setReportList] = useState<Report[]>([]);
  const [pageNo] = useState(1);
  const [pageSize] = useState(99);
  const [statistics, setStatistics] = useState<StatisticSystemResponse>();

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Tải cả component lười biếng và dữ liệu API song song
        // const [uniData, reportData] = await Promise.all([
        const [uniData, report, statData] = await Promise.all([
          UniversityList(pageSize, pageNo),
          getReportList(),
          GetStatisticSystem(), // Gọi API thống kê hệ thống
        ]);

        setUniversityList(
          uniData.data?.data
            .filter((uni) => uni.status === "PENDING")
            .slice(0, 4) || []
        ); // Lọc và giới hạn 4 trường đại học
        setReportList(report);
        setStatistics(statData.data);
        // setReportList(reportData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };

    loadAllData();
  }, [pageNo, pageSize]);

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2"></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              {formatPrice(Number(statistics?.revenue))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Universities
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.numOfActiveUniversities} universities
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number of contract
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.numOfContracts} contract
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sử dụng Suspense cho Lazy Loading */}
      <React.Suspense fallback={<LoadingAnimation />}>
        {/* Hiển thị spinner nếu API chưa tải xong */}
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PendingUniversityList data={universityList} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ReportList data={reportList} />
            </div>
          </>
        )}
      </React.Suspense>
    </>
  );
}
