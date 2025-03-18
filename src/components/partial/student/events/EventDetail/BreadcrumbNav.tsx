import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CornerUpLeft } from "lucide-react";

interface BreadcrumbNavProps {
  previousPage: string;
  breadcrumbLabel: string;
  eventName?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  previousPage,
  breadcrumbLabel,
  eventName,
}) => {
  return (
    <nav className="text-sm text-gray-600 mb-6 flex items-center gap-2">
      <CornerUpLeft
        size={24}
        onClick={() => window.history.back()}
        className="cursor-pointer"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-lg">
            <BreadcrumbLink href={previousPage}>
              {breadcrumbLabel}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-lg">
            <BreadcrumbPage>{eventName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};
