import { STATUS_COLORS } from '../../utils/statusColors';

/**
 * A consistent, color-coded status pill used across all modules.
 * Works for Vehicle, Driver, Trip, and Maintenance statuses.
 */
export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.retired;
  const label = status?.replace('_', ' ') ?? 'unknown';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}
