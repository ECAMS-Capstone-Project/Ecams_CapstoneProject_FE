import React from "react";

const Pricing = React.lazy(
  () => import("@/components/partial/representative/list-package")
);

export default function PackageList() {
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2"></div>
      </div>
      <div>
        <Pricing />
      </div>
    </>
  );
}
