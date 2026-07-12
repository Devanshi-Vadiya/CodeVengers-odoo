import { LayoutDashboard, Car, Users, Map, Wrench, DollarSign, FileText, Settings, User, History, CheckSquare, AlertTriangle, PieChart, TrendingUp } from 'lucide-react';
import { ROLES } from './roles';

export const SIDEBAR_ITEMS = {
  [ROLES.MANAGER]: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Drivers', href: '/drivers', icon: Users },
    { name: 'Trips', href: '/trips', icon: Map },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Finance', href: '/finance', icon: DollarSign },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ],
  [ROLES.DRIVER]: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', href: '/my-trips', icon: Map },
    { name: 'Vehicle', href: '/vehicle-info', icon: Car },
    { name: 'Trip History', href: '/trip-history', icon: History },
    { name: 'Profile', href: '/profile', icon: User },
  ],
  [ROLES.SAFETY]: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicle Inspection', href: '/inspections', icon: CheckSquare },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Safety Reports', href: '/safety-reports', icon: AlertTriangle },
    { name: 'Inspection History', href: '/inspection-history', icon: History },
  ],
  [ROLES.ANALYST]: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Finance', href: '/finance', icon: DollarSign },
    { name: 'Expenses', href: '/expenses', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: PieChart },
  ]
};
