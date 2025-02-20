export interface Event {
    eventId: string; // NVARCHAR(36)
    representativeId?: string; // NVARCHAR(36)
    clubId?: string; // NVARCHAR(36)
    eventName: string; // NVARCHAR(MAX)
    imageUrl: string; // NVARCHAR(MAX)
    description: string; // NVARCHAR(MAX)
    location: string; // NVARCHAR(MAX)
    registeredStartDate: Date; // DATETIME2(7)
    registeredEndDate: Date; // DATETIME2(7)
    price: number; // FLOAT(53)
    maxParticipants?: number; // INT
    status: string; // NVARCHAR(20)
    createdDate?: Date; // DATETIME2(7)
    updatedDate?: Date; // DATETIME2(7)
  }
  