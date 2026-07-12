// Maps status → Tailwind classes used across ALL modules
// Vehicle: available | on_trip | in_shop | retired
// Driver:  available | on_trip | off_duty | suspended
// Trip:    draft | dispatched | completed | cancelled
// Maintenance: open | closed

export const STATUS_COLORS = {
  available:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  on_trip:    { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500',    border: 'border-blue-200'   },
  in_shop:    { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-500',  border: 'border-orange-200' },
  retired:    { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400',   border: 'border-slate-200'  },
  off_duty:   { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400',   border: 'border-slate-200'  },
  suspended:  { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500',     border: 'border-red-200'    },
  expired:    { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500',     border: 'border-red-200'    },
  draft:      { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400',   border: 'border-slate-200'  },
  dispatched: { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500',    border: 'border-blue-200'   },
  completed:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200'},
  cancelled:  { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400',   border: 'border-slate-200'  },
  open:       { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-500',  border: 'border-orange-200' },
  closed:     { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200'},
};

// Legacy colour string map (kept for any existing usages)
export const statusColors = {
  available: 'green', on_trip: 'blue', in_shop: 'orange', retired: 'gray',
  off_duty: 'gray', suspended: 'gray', expired: 'gray',
  draft: 'gray', dispatched: 'blue', completed: 'green', cancelled: 'gray',
  open: 'orange', closed: 'green',
};
