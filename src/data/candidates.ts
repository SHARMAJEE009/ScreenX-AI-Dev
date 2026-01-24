import { Candidate } from "@/types";

const WEBHOOK_URL =
  "https://n8n.srv982383.hstgr.cloud/webhook/3fe63309-ad48-4e04-a403-81102bfbe701";

type WebhookCandidate = {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  location: string;
  position_applied: string;
  short_listed: "YES" | "NO" | "PENDING";
  reason: string;
  created_at: string;
};

export async function fetchCandidates(): Promise<Candidate[]> {
  const res = await fetch(WEBHOOK_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch candidates");
  }

  const data: WebhookCandidate[] = await res.json();

  // Convert webhook response -> your frontend Candidate format
  return data.map((item) => ({
    id: String(item.id),
    Full_Name: item.full_name,
    Number: item.phone_number,
    Email: item.email,
    Location: item.location,
    Position_Applied: item.position_applied,
    Short_Listed: item.short_listed,
    Reason: item.reason,
    Created_At: new Date(item.created_at).toISOString(),
  }));
}
