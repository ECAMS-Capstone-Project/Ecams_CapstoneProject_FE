export interface Policy {
    policyId: string;
    title: string;
    description: string;
    effectiveAt: Date;
    status: boolean;
    createdDate: Date;
    updatedDate: Date;
    roleName: Array<string>;
  }
  