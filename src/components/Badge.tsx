interface BadgeProps {
  status: 'YES' | 'NO' | 'PENDING';
  size?: 'sm' | 'md';
}

export default function Badge({ status, size = 'md' }: BadgeProps) {
  const config = {
    YES: {
      label: 'Shortlisted',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    NO: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    PENDING: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
  };

  const { label, className } = config[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${className} ${sizeClass}`}
    >
      {label}
    </span>
  );
}
