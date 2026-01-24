import { Search } from 'lucide-react';
import { FilterOptions } from '@/types';

interface SearchFilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  positions: string[];
  locations: string[];
}

export default function SearchFilterBar({
  filters,
  onFiltersChange,
  positions,
  locations,
}: SearchFilterBarProps) {
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search name, email, position..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Position Filter */}
        <select
          value={filters.position}
          onChange={e => updateFilter('position', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Positions</option>
          {positions.map(pos => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>

        {/* Short Listed Filter */}
        <select
          value={filters.shortListed}
          onChange={e => updateFilter('shortListed', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="YES">Shortlisted</option>
          <option value="NO">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>

        {/* Location Filter */}
        <select
          value={filters.location}
          onChange={e => updateFilter('location', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
