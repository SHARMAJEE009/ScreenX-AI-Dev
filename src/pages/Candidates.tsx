import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { apiService } from '@/services/api';
import { Candidate, FilterOptions, SortField, SortDirection } from '@/types';
import SearchFilterBar from '@/components/SearchFilterBar';
import Badge from '@/components/Badge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import CandidateDetailsModal from '@/components/CandidateDetailsModal';
import { toast } from '@/utils/toast';

// type FilterOptions = {
//   search?: string;
//   position?: string;
//   shortListed?: string;
//   location?: string;
// };


export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    position: '',
    shortListed: undefined,
    location: '',
  });
  const [sortField, setSortField] = useState<SortField | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageSize = 10;

  // Get unique positions and locations for filters from all candidates
  const positions = Array.from(new Set(allCandidates.map(c => c.Position_Applied))).sort();
  const locations = Array.from(new Set(allCandidates.map(c => c.Location))).sort();

  // Load all candidates once for filter options
  useEffect(() => {
    const loadAllCandidates = async () => {
      try {
        const result = await apiService.getCandidates({}, undefined, undefined, 1, 1000);
        setAllCandidates(result.data);
      } catch (error) {
        console.error('Failed to load all candidates for filters:', error);
      }
    };
    loadAllCandidates();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters or sorting change
  }, [filters, sortField, sortDirection]);

  useEffect(() => {
    loadCandidates();
  }, [filters, sortField, sortDirection, currentPage]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const result = await apiService.getCandidates(
        filters,
        sortField,
        sortDirection,
        currentPage,
        pageSize
      );
      setCandidates(result.data);
      setTotal(result.total);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Failed to load candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} className="inline ml-1" />
    ) : (
      <ChevronDown size={16} className="inline ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
        <p className="text-gray-600 mt-2">Manage and review all candidate applications</p>
      </div>

      <SearchFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        positions={positions}
        locations={locations}
      />

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : candidates.length === 0 ? (
          <EmptyState message="No candidates found" description="Try adjusting your filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('Full_Name')}
                    >
                      Full Name
                      <SortIcon field="Full_Name" />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Location
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('Position_Applied')}
                    >
                      Position Applied
                      <SortIcon field="Position_Applied" />
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('Short_Listed')}
                    >
                      Short Listed
                      <SortIcon field="Short_Listed" />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Reason
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
                      <td className="px-6 py-4 text-sm text-gray-600">{candidate.Number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{candidate.Email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{candidate.Location}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {candidate.Position_Applied}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={candidate.Short_Listed} />
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm text-gray-600">
                          {candidate.Reason.length > 100 ? (
                            <>
                              <span>{candidate.Reason.substring(0, 100)}...</span>
                              <button
                                onClick={() => handleViewDetails(candidate)}
                                className="ml-2 text-primary-600 hover:text-primary-700 font-medium"
                              >
                                Read more
                              </button>
                            </>
                          ) : (
                            <span>{candidate.Reason}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(candidate)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, total)} of {total} candidates
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
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
