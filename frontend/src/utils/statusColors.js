// Maps status → Tailwind classes using the new dark mode theme variables
// Vehicle: available | on_trip | in_shop | retired
// Driver:  available | on_trip | off_duty | suspended
// Trip:    draft | dispatched | completed | cancelled
// Maintenance: open | closed

export const STATUS_COLORS = {
  // Live / In Motion (Amber - accent-signal)
  on_trip:    { bg: 'bg-accent-signal/10', text: 'text-accent-signal', dot: 'bg-accent-signal', border: 'border-accent-signal/20' },
  dispatched: { bg: 'bg-accent-signal/10', text: 'text-accent-signal', dot: 'bg-accent-signal', border: 'border-accent-signal/20' },
  open:       { bg: 'bg-accent-signal/10', text: 'text-accent-signal', dot: 'bg-accent-signal', border: 'border-accent-signal/20' },

  // Available / Healthy (Teal - status-available)
  available:  { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  completed:  { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },
  closed:     { bg: 'bg-status-available/10', text: 'text-status-available', dot: 'bg-status-available', border: 'border-status-available/20' },

  // Blocked / In Shop (Red-Orange - status-shop)
  in_shop:    { bg: 'bg-status-shop/10', text: 'text-status-shop', dot: 'bg-status-shop', border: 'border-status-shop/20' },
  suspended:  { bg: 'bg-status-shop/10', text: 'text-status-shop', dot: 'bg-status-shop', border: 'border-status-shop/20' },
  expired:    { bg: 'bg-status-shop/10', text: 'text-status-shop', dot: 'bg-status-shop', border: 'border-status-shop/20' },

  // Inactive / Muted (Slate - status-retired)
  retired:    { bg: 'bg-status-retired/10', text: 'text-text-primary', dot: 'bg-status-retired', border: 'border-status-retired/30' },
  off_duty:   { bg: 'bg-status-retired/10', text: 'text-text-primary', dot: 'bg-status-retired', border: 'border-status-retired/30' },
  draft:      { bg: 'bg-status-retired/10', text: 'text-text-primary', dot: 'bg-status-retired', border: 'border-status-retired/30' },
  cancelled:  { bg: 'bg-status-retired/10', text: 'text-text-primary', dot: 'bg-status-retired', border: 'border-status-retired/30' },
};

// Legacy colour string map (kept for any existing usages)
export const statusColors = {
  available: 'green', on_trip: 'blue', in_shop: 'orange', retired: 'gray',
  off_duty: 'gray', suspended: 'gray', expired: 'gray',
  draft: 'gray', dispatched: 'blue', completed: 'green', cancelled: 'gray',
  open: 'orange', closed: 'green',
};
