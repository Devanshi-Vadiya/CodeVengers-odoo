import { STATUS_COLORS } from '../../utils/statusColors';

/**
 * A consistent, color-coded status pill used across all modules.
 * Ensures accessibility (AA contrast) and colorblind safety by pairing color with the label text.
 */
export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.retired;
  const label = status?.replace('_', ' ') ?? 'unknown';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shadow-[0_0_8px_currentColor]`}></span>
      {label}
    </span>
  );
}
