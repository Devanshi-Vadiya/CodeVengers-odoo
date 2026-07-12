export const ROLES = {
  MANAGER: 'manager',
  DRIVER: 'driver',
  SAFETY: 'safety',
  ANALYST: 'analyst',
};

export const ROLE_DETAILS = {
  [ROLES.MANAGER]: {
    id: ROLES.MANAGER,
    title: 'Fleet Manager',
    description: 'Manage vehicles, drivers, and dispatch trips.',
    color: 'blue'
  },
  [ROLES.DRIVER]: {
    id: ROLES.DRIVER,
    title: 'Driver',
    description: 'View assigned trips and update trip status.',
    color: 'emerald'
  },
  [ROLES.SAFETY]: {
    id: ROLES.SAFETY,
    title: 'Safety Checker',
    description: 'Inspect vehicles and manage maintenance queues.',
    color: 'orange'
  },
  [ROLES.ANALYST]: {
    id: ROLES.ANALYST,
    title: 'Financial Analyst',
    description: 'Track expenses, revenue, and fleet ROI.',
    color: 'purple'
  }
};
