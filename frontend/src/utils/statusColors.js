// Maps status → Tailwind classes using the clean premium palette
// Vehicle: available | on_trip | in_shop | retired
// Driver:  available | on_trip | off_duty | suspended
// Trip:    draft | dispatched | completed | cancelled
// Maintenance: open | closed

export const STATUS_COLORS = {
  // Live / In Motion (Blue - accent-signal)
  on_trip:    { bg: 'bg-accent-signal/10', text: 'text-accent-signal', dot: 'bg-accent-signal', border: 'border-accent-signal/20' },
  dispatched: { bg: 'bg-accent-signal/10', text: 'text-accent-signal', dot: 'bg-accent-signal', border: 'border-accent-signal/20' },
  open:       { bg: 'bg-accent-signal/10', text: 'text-accent-signal', dot: 'bg-accent-signal', border: 'border-accent-signal/20' },

  // Available / Healthy (Emerald - status-available)
  available:  { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  completed:  { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  closed:     { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },

  // Warning / Shop (Amber - status-shop)
  in_shop:    { bg: 'bg-status-shop/10', text: 'text-status-shop', dot: 'bg-status-shop', border: 'border-status-shop/20' },
  suspended:  { bg: 'bg-status-shop/10', text: 'text-status-shop', dot: 'bg-status-shop', border: 'border-status-shop/20' },
  expired:    { bg: 'bg-status-shop/10', text: 'text-status-shop', dot: 'bg-status-shop', border: 'border-status-shop/20' },

  // Inactive / Muted (Zinc - status-retired)
  retired:    { bg: 'bg-surface-raised', text: 'text-text-secondary', dot: 'bg-status-retired', border: 'border-surface-raised' },
  off_duty:   { bg: 'bg-surface-raised', text: 'text-text-secondary', dot: 'bg-status-retired', border: 'border-surface-raised' },
  draft:      { bg: 'bg-surface-raised', text: 'text-text-secondary', dot: 'bg-status-retired', border: 'border-surface-raised' },
  cancelled:  { bg: 'bg-surface-raised', text: 'text-text-secondary', dot: 'bg-status-retired', border: 'border-surface-raised' },
};

// Legacy colour string map (kept for any existing usages)
export const statusColors = {
  available: 'green', on_trip: 'blue', in_shop: 'orange', retired: 'gray',
  off_duty: 'gray', suspended: 'gray', expired: 'gray',
  draft: 'gray', dispatched: 'blue', completed: 'green', cancelled: 'gray',
  open: 'orange', closed: 'green',
};
