export interface Candidate {
  id: string;
  Full_Name: string;
  Number: string;
  Email: string;
  Location: string;
  Position_Applied: string;
  Short_Listed: 'YES' | 'NO' | 'PENDING';
  Reason: string;
  Notes?: string;
  Created_At?: string;
}

export interface Analytics {
  totalCandidates: number;
  totalShortlisted: number;
  totalRejected: number;
  totalPending: number;
  positionWiseCount: { position: string; count: number }[];
  shortlistedVsRejected: { status: string; count: number }[];
  topLocations: { location: string; count: number }[];
  averageShortlistRate: { position: string; rate: number }[];
}

export type SortField = 'Full_Name' | 'Position_Applied' | 'Short_Listed';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
 search?: string;
  location?: string;
  position?: string;
  shortListed?: "YES" | "NO";
}
