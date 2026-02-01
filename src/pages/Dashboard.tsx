import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import KPICard from "@/components/KPICard";
import { apiService } from "@/services/api";
import { Analytics, Candidate } from "@/types";
import { CardSkeleton, TableSkeleton } from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, candidatesData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getCandidates(
  {
    search: "",
    position: "",
    shortListed: "",
    location: "",
  },
  undefined,
  undefined,
  1,
  5
),
      ]);
      setAnalytics(analyticsData);
      setRecentCandidates(candidatesData.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your candidates.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : analytics ? (
          <>
            <KPICard
              title="Total Candidates"
              value={analytics.totalCandidates}
              icon={Users}
              color="blue"
            />
            <KPICard
              title="Total Shortlisted"
              value={analytics.totalShortlisted}
              icon={CheckCircle}
              color="green"
            />
            <KPICard
              title="Total Rejected"
              value={analytics.totalRejected}
              icon={XCircle}
              color="orange"
            />
            <KPICard
              title="Pending Review"
              value={analytics.totalPending}
              icon={Clock}
              color="purple"
            />
          </>
        ) : null}
      </div>

      {/* Recent Candidates */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Candidates
          </h2>
          <Link
            to="/candidates"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <TableSkeleton />
          ) : recentCandidates.length === 0 ? (
            <EmptyState message="No recent candidates" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">
                      Position
                    </th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {candidate.Full_Name}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {candidate.Email}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {candidate.Position_Applied}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {candidate.Location}
                      </td>
                      <td className="py-3">
                        <Badge status={candidate.Short_Listed} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
