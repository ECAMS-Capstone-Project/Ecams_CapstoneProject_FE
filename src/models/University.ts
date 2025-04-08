export interface University {
    universityId: string; // Primary key
    representativeId: string; // Foreign key referencing Staffs table
  representativeName?: string; // Staff name
  universityName: string; // University name
  universityAddress?: string; // Optional university address
  status: string; // Status of the university
  shortName: string; // Short name of the university
  contactEmail: string; // Contact email
  contactPhone: string; // Contact phone number
  logoLink: string; // Logo link
  location?: string; // Optional location
  websiteUrl?: string; // Optional website URL
  subscriptionStatus: string; // Subscription status
  createdDate?: Date; // Optional created date
  updatedDate?: Date; // Optional updated date
}