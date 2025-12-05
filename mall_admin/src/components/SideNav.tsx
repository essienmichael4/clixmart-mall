import logo from '../assets/logo.jpeg';
import { MdLocalShipping, MdDeliveryDining  } from "react-icons/md";
import { FaHubspot } from "react-icons/fa6";
import { RiGuideLine } from "react-icons/ri";
import { Activity, BaggageClaim, GripVertical, LayoutDashboard, PackageSearch, Settings, ShoppingBag, Store, Users, FileText, Landmark, Captions } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

interface SideNavProps {
  isToggled: boolean;
}

interface NavLinkItem {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
  exact?: boolean;
}

interface GroupedLink {
  title?: string;
  links: NavLinkItem[];
}

const SideNav = ({ isToggled }: SideNavProps) => {
  const groupedLinks: GroupedLink[] = [
    {
      title: 'Overview',
      links: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Management',
      links: [
        { to: '/categories', label: 'Categories', icon: GripVertical },
        { to: '/brands', label: 'Brands', icon: BaggageClaim },
        { to: '/vendors', label: 'Vendors', icon: Store },
      ],
    },
    {
      title: 'Products & Orders',
      links: [
        { to: '/products', label: 'Products', icon: PackageSearch },
        { to: '/orders', label: 'Orders', icon: ShoppingBag },
      ],
    },
    {
      title: 'Deliveries & Couriers',
      links: [
        { to: '/deliveries', label: 'Deliveries', icon: RiGuideLine },
        { to: '/carriers', label: 'Carriers', icon: MdLocalShipping },
        { to: '/couriers', label: 'Couriers', icon: MdDeliveryDining },
        { to: '/hubs', label: 'Hubs', icon: FaHubspot },
      ],
    },
    {
      title: 'Finance',
      links: [
        { to: '/commissions', label: 'Commissions', icon: Activity },
        { to: '/commissions/statements/audit-logs', label: 'Audit Logs', icon: FileText },
        { to: '/commissions/statements', label: 'History Ledger', icon: Landmark, exact: true },
        { to: '/commissions/statements/accounts-ledger', label: 'Account Ledger', icon: Captions },
      ],
    },
    {
      title: 'Users & Settings',
      links: [
        { to: '/users', label: 'Users', icon: Users },
        { to: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <nav
      className={`fixed top-0 bottom-0 z-50 py-3 backdrop-blur-lg border-r border-neutral-100/80 transition-all ease-in-out duration-500
        ${isToggled ? 'lg:w-[4rem] w-[4rem]' : 'lg:w-[220px] w-[220px]'}`}
    >
      <div className="px-4 mx-auto relative text-sm h-full flex flex-col">
        {/* LOGO */}
        <div className="flex items-center flex-shrink-0 mb-6">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="h-10 w-10 mr-3" />
            {!isToggled && (
              <span className="text-xl tracking-tight whitespace-nowrap font-semibold">
                CLIXMART
              </span>
            )}
          </Link>
        </div>

        {/* SCROLLABLE NAV */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {groupedLinks.map((group) => (
            <div key={group.title} className="mb-4">
              {!isToggled && (
                <div className="text-xs font-semibold text-neutral-500 uppercase mb-2 tracking-wide">
                  {group.title}
                </div>
              )}

              {group.links.map(({ to, label, icon: Icon, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact ? true : false} 
                  className={({ isActive }) =>
                    `pl-1 py-2 flex items-center mb-1 rounded-md transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-6 flex-shrink-0" />
                  {!isToggled && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-4 border-t border-neutral-100">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `pl-1 py-2 flex items-center rounded-md mb-2 transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50'
              }`
            }
          >
            <Settings className="h-5 w-5 mr-6" />
            {!isToggled && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
