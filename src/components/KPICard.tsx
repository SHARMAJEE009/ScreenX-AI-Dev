import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'blue' | 'purple' | 'green' | 'orange';
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
}: KPICardProps) {
  const colorConfig = {
    blue: {
      gradient: 'from-primary-500 to-primary-600',
      icon: 'text-primary-600',
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      icon: 'text-purple-600',
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      icon: 'text-green-600',
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      icon: 'text-orange-600',
    },
  };

  const config = colorConfig[color];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${config.gradient} bg-opacity-10`}>
          <Icon className={config.icon} size={24} />
        </div>
        {trend && (
          <span className="text-sm text-gray-500 font-medium">{trend}</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}
