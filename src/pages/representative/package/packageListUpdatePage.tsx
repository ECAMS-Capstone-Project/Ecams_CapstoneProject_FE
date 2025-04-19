import { Package } from "@/models/Package";
import React from "react";
import { useLocation } from "react-router-dom";

const ListPackageUpdate = React.lazy(
  () => import("@/components/partial/representative/representative-update-package/list-package-update")
);

export default function PackageListUpdatePage() {
  const location = useLocation();
  const curPackage = location.state.curPackage as Package;
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2"></div>
      </div>
      <div>
        <ListPackageUpdate curPackage={curPackage} />
      </div>
    </>
  );
}
