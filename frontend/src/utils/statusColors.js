/**
 * Single source of truth for ALL status colors across the app.
 * Uses hex values so they work reliably in both Tailwind classes and inline styles.
 * 
 * STATUS_META  — use getStatusColor() / getStatusMeta() in components
 * STATUS_COLORS — legacy Tailwind class map, kept for non-badge usages
 */

export const STATUS_META = {
  // Trip statuses
  draft:      { hex: '#94A3B8', label: 'Draft'      },
  dispatched: { hex: '#3B82F6', label: 'Dispatched'  },
  completed:  { hex: '#22C55E', label: 'Completed'   },
  cancelled:  { hex: '#EF4444', label: 'Cancelled'   },

  // Vehicle statuses
  available:  { hex: '#22C55E', label: 'Available'   },
  on_trip:    { hex: '#3B82F6', label: 'On Trip'     },
  in_shop:    { hex: '#F59E0B', label: 'In Shop'     },
  retired:    { hex: '#94A3B8', label: 'Retired'     },

  // Driver statuses
  off_duty:   { hex: '#94A3B8', label: 'Off Duty'    },
  suspended:  { hex: '#EF4444', label: 'Suspended'   },

  // Maintenance
  open:       { hex: '#F59E0B', label: 'Open'        },
  closed:     { hex: '#22C55E', label: 'Closed'      },

  // License
  expired:    { hex: '#EF4444', label: 'Expired'     },
};

/** Returns the hex color for a given status, with a safe fallback. */
export function getStatusColor(status) {
  return STATUS_META[status]?.hex ?? '#8B93A7';
}

/** Returns the full meta object for a given status. */
export function getStatusMeta(status) {
  return STATUS_META[status] ?? STATUS_META.draft;
}

// Legacy Tailwind class map — kept so existing non-badge code doesn't break
export const STATUS_COLORS = {
  available:  { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  on_trip:    { bg: 'bg-status-dispatched/10', text: 'text-status-dispatched', dot: 'bg-status-dispatched', border: 'border-status-dispatched/20' },
  in_shop:    { bg: 'bg-status-shop/10',       text: 'text-status-shop',       dot: 'bg-status-shop',       border: 'border-status-shop/20'      },
  retired:    { bg: 'bg-base-mid',             text: 'text-text-secondary',    dot: 'bg-status-retired',    border: 'border-app-border'          },
  off_duty:   { bg: 'bg-base-mid',             text: 'text-text-secondary',    dot: 'bg-status-retired',    border: 'border-app-border'          },
  suspended:  { bg: 'bg-red-50',              text: 'text-red-500',           dot: 'bg-red-400',           border: 'border-red-200'             },
  draft:      { bg: 'bg-base-mid',             text: 'text-text-secondary',    dot: 'bg-status-retired',    border: 'border-app-border'          },
  dispatched: { bg: 'bg-blue-50',             text: 'text-blue-600',          dot: 'bg-blue-400',          border: 'border-blue-200'            },
  completed:  { bg: 'bg-status-available/10', text: 'text-status-available',  dot: 'bg-status-available',  border: 'border-status-available/20' },
  cancelled:  { bg: 'bg-red-50',              text: 'text-red-500',           dot: 'bg-red-400',           border: 'border-red-200'             },
  open:       { bg: 'bg-amber-50',            text: 'text-amber-600',         dot: 'bg-amber-400',         border: 'border-amber-200'           },
  closed:     { bg: 'bg-status-available/10', text: 'text-status-available',  dot: 'bg-status-available',  border: 'border-status-available/20' },
  expired:    { bg: 'bg-red-50',              text: 'text-red-500',           dot: 'bg-red-400',           border: 'border-red-200'             },
};
