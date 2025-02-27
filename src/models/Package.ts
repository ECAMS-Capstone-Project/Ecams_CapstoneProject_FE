export interface PackageDetail {
  packageServiceId: string; // Unique identifier for the package service
  packageType: string; // Type of service (e.g., Students, Clubs, Events)
  value: string; // Value associated with the service
}

export interface Package {
  packageId: string; // Unique identifier for the package
  packageName: string; // Name of the package
  createdBy: string; // User who created the package
  updatedBy: string | null; // User who last updated the package, null if not updated
  price: number; // Price of the package
  status: boolean; // Status of the package (e.g., active/inactive)
  duration: number; // Duration of the package in months
  description: string; // Description of the package
  endOfSupportDate: string | null; // End date of support, null if not applicable
  packageDetails: PackageDetail[]; // List of details for the package services
  endDate: string;
}
