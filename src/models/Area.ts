export interface Area {
    areaId: string;
    universityId: string;
    name: string;
    description: string;
    capacity: number;
    status: boolean;
    imageUrl: string;
    universityName: string;
}

export interface AreaDetails {
    UniversityId: string;
    Name: string;
    Description: string;
    Capacity: number;
    ImageUrl: string;
}

export interface EventAreas {
    areaId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;
}