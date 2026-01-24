import { useEffect, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { apiService } from '@/services/api';
import { Candidate, FilterOptions } from '@/types';
import Badge from '@/components/Badge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import CandidateDetailsModal from '@/components/CandidateDetailsModal';
import { toast } from '@/utils/toast';

export default function Shortlisted() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, [search]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const filters: Omit<FilterOptions, 'shortListed'> = {
        search,
        position: '',
        location: '',
      };
      const result = await apiService.getShortlistedCandidates(filters, 1, 100);
      setCandidates(result.data);
    } catch (error) {
      console.error('Failed to load shortlisted candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const csvContent = await apiService.exportToCSV(candidates);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shortlisted-candidates-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    loadCandidates();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shortlisted Candidates</h1>
          <p className="text-gray-600 mt-2">View and manage all shortlisted candidates</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={candidates.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : candidates.length === 0 ? (
          <EmptyState
            message="No shortlisted candidates"
            description="Candidates marked as shortlisted will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Position Applied
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {candidate.Full_Name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{candidate.Email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{candidate.Location}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {candidate.Position_Applied}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={candidate.Short_Listed} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(candidate)}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
