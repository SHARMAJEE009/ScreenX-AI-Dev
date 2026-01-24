// import { Candidate, Analytics, FilterOptions, SortField, SortDirection } from '@/types';
// import { mockCandidates } from '@/data/mockData';

// // Simulate API delay
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// // In production, replace these with actual API calls to your MySQL backend
// // Example: const API_BASE_URL = 'http://localhost:3000/api';

// class ApiService {
//   private candidates: Candidate[] = [...mockCandidates];

//   async getCandidates(
//     filters?: FilterOptions,
//     sortField?: SortField,
//     sortDirection?: SortDirection,
//     page: number = 1,
//     pageSize: number = 10
//   ): Promise<{ data: Candidate[]; total: number }> {
//     await delay(500); // Simulate network delay

//     let filtered = [...this.candidates];

//     // Apply filters
//     if (filters) {
//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase();
//         filtered = filtered.filter(
//           c =>
//             c.Full_Name.toLowerCase().includes(searchLower) ||
//             c.Email.toLowerCase().includes(searchLower) ||
//             c.Position_Applied.toLowerCase().includes(searchLower)
//         );
//       }

//       if (filters.position) {
//         filtered = filtered.filter(c => c.Position_Applied === filters.position);
//       }

//       if (filters.shortListed) {
//         filtered = filtered.filter(c => c.Short_Listed === filters.shortListed);
//       }

//       if (filters.location) {
//         filtered = filtered.filter(c => c.Location === filters.location);
//       }
//     }

//     // Apply sorting
//     if (sortField && sortDirection) {
//       filtered.sort((a, b) => {
//         const aVal = a[sortField];
//         const bVal = b[sortField];
//         const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
//         return sortDirection === 'asc' ? comparison : -comparison;
//       });
//     }

//     const total = filtered.length;
//     const start = (page - 1) * pageSize;
//     const end = start + pageSize;
//     const paginated = filtered.slice(start, end);

//     return { data: paginated, total };
//   }

//   async getCandidateById(id: string): Promise<Candidate | null> {
//     await delay(300);
//     const candidate = this.candidates.find(c => c.id === id);
//     return candidate || null;
//   }

//   async updateCandidateStatus(
//     id: string,
//     status: 'YES' | 'NO' | 'PENDING',
//     reason?: string,
//     notes?: string
//   ): Promise<Candidate> {
//     await delay(400);
//     const candidate = this.candidates.find(c => c.id === id);
//     if (!candidate) {
//       throw new Error('Candidate not found');
//     }

//     candidate.Short_Listed = status;
//     if (reason) candidate.Reason = reason;
//     if (notes !== undefined) candidate.Notes = notes;

//     return candidate;
//   }

//   async getShortlistedCandidates(
//     filters?: Omit<FilterOptions, 'shortListed'>,
//     page: number = 1,
//     pageSize: number = 10
//   ): Promise<{ data: Candidate[]; total: number }> {
//     return this.getCandidates(
//       { ...filters, shortListed: 'YES' },
//       undefined,
//       undefined,
//       page,
//       pageSize
//     );
//   }

//   async getRejectedCandidates(
//     filters?: Omit<FilterOptions, 'shortListed'>,
//     page: number = 1,
//     pageSize: number = 10
//   ): Promise<{ data: Candidate[]; total: number }> {
//     return this.getCandidates(
//       { ...filters, shortListed: 'NO' },
//       undefined,
//       undefined,
//       page,
//       pageSize
//     );
//   }

//   async getAnalytics(): Promise<Analytics> {
//     await delay(400);

//     const totalCandidates = this.candidates.length;
//     const totalShortlisted = this.candidates.filter(c => c.Short_Listed === 'YES').length;
//     const totalRejected = this.candidates.filter(c => c.Short_Listed === 'NO').length;
//     const totalPending = this.candidates.filter(c => c.Short_Listed === 'PENDING').length;

//     // Position-wise count
//     const positionMap = new Map<string, number>();
//     this.candidates.forEach(c => {
//       positionMap.set(c.Position_Applied, (positionMap.get(c.Position_Applied) || 0) + 1);
//     });
//     const positionWiseCount = Array.from(positionMap.entries()).map(([position, count]) => ({
//       position,
//       count,
//     }));

//     // Shortlisted vs Rejected
//     const shortlistedVsRejected = [
//       { status: 'Shortlisted', count: totalShortlisted },
//       { status: 'Rejected', count: totalRejected },
//     ];

//     // Top locations
//     const locationMap = new Map<string, number>();
//     this.candidates.forEach(c => {
//       locationMap.set(c.Location, (locationMap.get(c.Location) || 0) + 1);
//     });
//     const topLocations = Array.from(locationMap.entries())
//       .map(([location, count]) => ({ location, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5);

//     // Average shortlist rate per position
//     const positionShortlistMap = new Map<string, { total: number; shortlisted: number }>();
//     this.candidates.forEach(c => {
//       const current = positionShortlistMap.get(c.Position_Applied) || { total: 0, shortlisted: 0 };
//       current.total++;
//       if (c.Short_Listed === 'YES') current.shortlisted++;
//       positionShortlistMap.set(c.Position_Applied, current);
//     });
//     const averageShortlistRate = Array.from(positionShortlistMap.entries()).map(
//       ([position, data]) => ({
//         position,
//         rate: (data.shortlisted / data.total) * 100,
//       })
//     );

//     return {
//       totalCandidates,
//       totalShortlisted,
//       totalRejected,
//       totalPending,
//       positionWiseCount,
//       shortlistedVsRejected,
//       topLocations,
//       averageShortlistRate,
//     };
//   }

//   async exportToCSV(candidates: Candidate[]): Promise<string> {
//     const headers = [
//       'Full Name',
//       'Number',
//       'Email',
//       'Location',
//       'Position Applied',
//       'Short Listed',
//       'Reason',
//     ];
//     const rows = candidates.map(c => [
//       c.Full_Name,
//       c.Number,
//       c.Email,
//       c.Location,
//       c.Position_Applied,
//       c.Short_Listed,
//       c.Reason.replace(/,/g, ';'), // Replace commas in reason to avoid CSV issues
//     ]);

//     const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
//     return csvContent;
//   }
// }

// export const apiService = new ApiService();
import { Candidate, Analytics, FilterOptions, SortField, SortDirection } from "@/types";

// Simulate API delay (optional)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const WEBHOOK_URL =
  "https://n8n.srv982383.hstgr.cloud/webhook/3fe63309-ad48-4e04-a403-81102bfbe701";

// type WebhookCandidate = {
//   id: number;
//   full_name: string;
//   phone_number: string;
//   email: string;
//   location: string;
//   position_applied: string;
//   short_listed: "YES" | "NO" | "PENDING";
//   reason: string;
//   created_at: string;
// };

class ApiService {
  private candidates: Candidate[] = [];
  private loaded = false;

  // 🔥 Load data from webhook once
  private async loadCandidatesFromWebhook() {
  if (this.loaded) return;

  const res = await fetch(WEBHOOK_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch candidates from webhook");
  }

  const raw = await res.json();

  // ✅ Make sure we always get an array
  let data: any[] = [];

  if (Array.isArray(raw)) {
    data = raw;
  } else if (raw && Array.isArray(raw.data)) {
    data = raw.data;
  } else if (raw && Array.isArray(raw.result)) {
    data = raw.result;
  } else {
    console.log("Webhook raw response:", raw);
    throw new Error("Webhook response is not an array");
  }

  // ✅ Handle n8n format: [{json:{...}}, {json:{...}}]
  if (data.length > 0 && data[0]?.json) {
    data = data.map((x: any) => x.json);
  }

  this.candidates = data.map((item: any) => ({
    id: String(item.id),
    Full_Name: item.full_name,
    Number: item.phone_number,
    Email: item.email,
    Location: item.location,
    Position_Applied: item.position_applied,
    Short_Listed: item.short_listed,
    Reason: item.reason,
    Created_At: item.created_at,
  }));

  this.loaded = true;
}


  async getCandidates(
    filters?: FilterOptions,
    sortField?: SortField,
    sortDirection?: SortDirection,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: Candidate[]; total: number }> {
    await this.loadCandidatesFromWebhook();
    await delay(200); // optional

    let filtered = [...this.candidates];

    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          c =>
            c.Full_Name.toLowerCase().includes(searchLower) ||
            c.Email.toLowerCase().includes(searchLower) ||
            c.Position_Applied.toLowerCase().includes(searchLower)
        );
      }

      if (filters.position) {
        filtered = filtered.filter(c => c.Position_Applied === filters.position);
      }

      if (filters.shortListed) {
        filtered = filtered.filter(c => c.Short_Listed === filters.shortListed);
      }

      if (filters.location) {
        filtered = filtered.filter(c => c.Location === filters.location);
      }
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    return { data: paginated, total };
  }

  async getCandidateById(id: string): Promise<Candidate | null> {
    await this.loadCandidatesFromWebhook();
    await delay(100);

    const candidate = this.candidates.find(c => c.id === id);
    return candidate || null;
  }

  async updateCandidateStatus(
    id: string,
    status: "YES" | "NO" | "PENDING",
    reason?: string,
    notes?: string
  ): Promise<Candidate> {
    await this.loadCandidatesFromWebhook();
    await delay(150);

    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    // ⚠️ This updates only frontend memory (NOT database)
    candidate.Short_Listed = status;
    if (reason) candidate.Reason = reason;
    if (notes !== undefined) candidate.Notes = notes;

    return candidate;
  }

  async getShortlistedCandidates(
    filters?: Omit<FilterOptions, "shortListed">,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: Candidate[]; total: number }> {
    return this.getCandidates(
  { ...filters, shortListed: "YES" as const },
  undefined,
  undefined,
  page,
  pageSize
);

  }

  async getRejectedCandidates(
    filters?: Omit<FilterOptions, "shortListed">,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: Candidate[]; total: number }> {
    return this.getCandidates(
      { ...filters, shortListed: "NO" as const },
      undefined,
      undefined,
      page,
      pageSize
    );
  }

  async getAnalytics(): Promise<Analytics> {
    await this.loadCandidatesFromWebhook();
    await delay(150);

    const totalCandidates = this.candidates.length;
    const totalShortlisted = this.candidates.filter(c => c.Short_Listed === "YES").length;
    const totalRejected = this.candidates.filter(c => c.Short_Listed === "NO").length;
    const totalPending = this.candidates.filter(c => c.Short_Listed === "PENDING").length;

    // Position-wise count
    const positionMap = new Map<string, number>();
    this.candidates.forEach(c => {
      positionMap.set(c.Position_Applied, (positionMap.get(c.Position_Applied) || 0) + 1);
    });

    const positionWiseCount = Array.from(positionMap.entries()).map(([position, count]) => ({
      position,
      count,
    }));

    // Shortlisted vs Rejected
    const shortlistedVsRejected = [
      { status: "Shortlisted", count: totalShortlisted },
      { status: "Rejected", count: totalRejected },
    ];

    // Top locations
    const locationMap = new Map<string, number>();
    this.candidates.forEach(c => {
      locationMap.set(c.Location, (locationMap.get(c.Location) || 0) + 1);
    });

    const topLocations = Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Average shortlist rate per position
    const positionShortlistMap = new Map<string, { total: number; shortlisted: number }>();
    this.candidates.forEach(c => {
      const current = positionShortlistMap.get(c.Position_Applied) || { total: 0, shortlisted: 0 };
      current.total++;
      if (c.Short_Listed === "YES") current.shortlisted++;
      positionShortlistMap.set(c.Position_Applied, current);
    });

    const averageShortlistRate = Array.from(positionShortlistMap.entries()).map(
      ([position, data]) => ({
        position,
        rate: (data.shortlisted / data.total) * 100,
      })
    );

    return {
      totalCandidates,
      totalShortlisted,
      totalRejected,
      totalPending,
      positionWiseCount,
      shortlistedVsRejected,
      topLocations,
      averageShortlistRate,
    };
  }

  async exportToCSV(candidates: Candidate[]): Promise<string> {
    const headers = [
      "Full Name",
      "Number",
      "Email",
      "Location",
      "Position Applied",
      "Short Listed",
      "Reason",
    ];

    const rows = candidates.map(c => [
      c.Full_Name,
      c.Number,
      c.Email,
      c.Location,
      c.Position_Applied,
      c.Short_Listed,
      c.Reason.replace(/,/g, ";"),
    ]);

    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }
}

export const apiService = new ApiService();
