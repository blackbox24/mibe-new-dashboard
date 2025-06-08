
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarHeader 
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Plane, 
  Hotel, 
  Package, 
  Car, 
  Bus, 
  FileText, 
  Compass,
  Menu,
  LogOut,
  User,
  ListIcon,
  ChevronDown,
  ChevronRight,
  MapIcon,
  ListCheck,
  MapPinnedIcon,
  PenToolIcon,
  JoystickIcon,
  BookAIcon,
  MapPinCheck,
  GiftIcon,
  Star,
  File,
  MapPin,
  Briefcase,
  PersonStandingIcon,
  User2,
  DollarSign,
  TableOfContents

} from 'lucide-react';

const DropDown2 = ({items,name,collapsed,icon}) => {
  const [show,setShow] = useState(false);
  const handleToggle = () => {
    setShow(!show)
  }
  return(
    <div>
      <div>
        <div onClick={handleToggle} className="flex w-full justify-start gap-x-1.5 rounded-md px-3 py-2 text-white-900 shadow-xs hover:bg-blue-900" id="menu-button" aria-expanded="true" aria-haspopup="true">
          <span className="flex-shrink-0">{icon}</span>
          {!collapsed && <span className="ml-3">{name}</span>}
          {show ? <ChevronDown className='flex-shrink-0'/> :<ChevronRight className='flex-shrink-0'/>}
        </div>
      </div>
      {
        show?
       
          <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-blue-900 shadow-lg ring-1 ring-black/5 focus:outline-hidden hover:bg-sidebar-accent/3" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            <div className="py-1" role="none">
               {
               items.map((item,index)=>(
                  item.dropdown?
                  <DropDown2 key={index} items={item.dropdown} name={item.name} icon={item.icon} collapsed={collapsed} />
                  :
                  <Link 
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md ",
                      "hover:bg-sidebar-accent/10",
                      location.pathname === item.href 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                  
               ))}
            </div>
          </div>
        
        :
        ""
      }
      </div>
  )
}


const DropDown = ({items,name,collapsed,icon}) => {
  const [show,setShow] = useState(false);
  const handleToggle = () => {
    setShow(!show)
  }
  return(
    <div>
      <div>
        <div onClick={handleToggle} className="flex w-full justify-start gap-x-1.5 rounded-md px-3 py-2 text-white-900 shadow-xs hover:bg-blue-900" id="menu-button" aria-expanded="true" aria-haspopup="true">
          <span className="flex-shrink-0">{icon}</span>
          {!collapsed && <span className="ml-3">{name}</span>}
          {show ? <ChevronDown className='flex-shrink-0 ml-10'/> :<ChevronRight className='flex-shrink-0 ml-10'/>}
        </div>
      </div>
      {
        show?
       
          <div className="relative right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-blue-900 shadow-lg ring-1 ring-black/5 focus:outline-hidden hover:bg-sidebar-accent/10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            <div className="py-1" role="none">
              {
               items.map((item,index)=>(
                  item.dropdown?
                  <DropDown2 key={index} items={item.dropdown} name={item.name} icon={item.icon} collapsed={collapsed} />
                  :
                  <Link 
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md transition-colors",
                      "hover:bg-sidebar-accent/10",
                      location.pathname === item.href 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                  
               ))}
            </div>
          </div>
        
        :
        ""
      }
      </div>
  )
}

const DashboardSidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Listings',
      icon:<ListIcon className="h-5 w-5" />,
      dropdown:[
        {
          name:"Travel Services",
          icon:<ListIcon className="h-5 w-5"/>,
          dropdown:[{
            name: 'Flights',
            href: '/flights',
            icon: <Plane className="h-5 w-5" />,
          },{
            name: 'Activities',
            href: '/activities',
            icon: <Compass className="h-5 w-5" />,
          },{
            name: 'Accommodations',
            href: '/accommodations',
            icon: <Hotel className="h-5 w-5" />,
          },{
            name: 'Vehicles Rentals',
            href: '/vehicles',
            icon: <Car className="h-5 w-5" />,
          },{
            name: 'Packages',
            href: '/packages',
            icon: <Package className="h-5 w-5" />,
          },{
            name: 'Shuttles',
            href: '/shuttles',
            icon: <Bus className="h-5 w-5" />,
          },{
            name: 'Facilitations',
            href: '/facilitations',
            icon: <FileText className="h-5 w-5" />,
          },]
        },
        {
          name:"Travel Resources",
          icon:<ListIcon className="h-5 w-5"/>,
          dropdown:[{
            name: 'Guides',
            href: '/guides',
            icon: <MapIcon className="h-5 w-5" />,
          },{
            name: 'Checklists',
            href: '/checklists',
            icon: <ListCheck className="h-5 w-5" />,
          },{
            name: 'Maps & Direction ',
            href: '/maps',
            icon: <MapPinnedIcon className="h-5 w-5" />,
          },{
            name: 'Toolkits',
            href: '/toolkits',
            icon: <PenToolIcon className="h-5 w-5" />,
          },{
            name: 'Games',
            href: '/games',
            icon: <JoystickIcon className="h-5 w-5" />,
          },]
        },
        {
          name:"Travel Inspiration",
          icon:<ListIcon className="h-5 w-5"/>,
          dropdown:[{
            name: 'Stories',
            href: '/stories',
            icon: <BookAIcon className="h-5 w-5" />,
          },{
            name: 'Destination',
            href: '/destinations',
            icon: <MapPinCheck className="h-5 w-5" />,
          },{
            name: 'Gifts',
            href: '/gifts',
            icon: <GiftIcon className="h-5 w-5" />,
          },{
            name: 'Cultural Events',
            href: '/cultural-events',
            icon: <MapPin className="h-5 w-5" />,
          },]
        },
        {
          name:"Other Listings",
          icon:<ListIcon className="h-5 w-5"/>,
          dropdown:[{
            name: 'Trusted By Partner',
            href: '/trustedby',
            icon: <PersonStandingIcon className="h-5 w-5" />,
          },{
            name: 'Team',
            href: '/teams',
            icon: <User2 className="h-5 w-5" />,
          },{
            name: 'Jobs',
            href: '/jobs',
            icon: <Briefcase className="h-5 w-5" />,
          },{
            name: 'Cases Studies',
            href: '/case-studies',
            icon: <File className="h-5 w-5" />,
          },{
            name: 'FAQs',
            href: '/faq',
            icon: <TableOfContents className="h-5 w-5" />,
          },{
            name: 'Terms',
            href: '/terms',
            icon: <File className="h-5 w-5" />,
          },{
            name: 'Partner Providers',
            href: '/case-studies',
            icon: <User2 className="h-5 w-5" />,
          }]
        }
    ]
    },
    
    
    
    {
      name: 'Bookings',
      href: '/bookings',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: 'Finances',
      href: '/finances',
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: 'Feedback',
      href: '/feedback',
      icon: <Star className="h-5 w-5" />,
    },
    
    
    
  ];

  return (
    <>
      <Sidebar
        className={cn(
          "h-screen z-40 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarHeader className="flex items-center justify-between p-4 h-16">
          <div className={cn("flex items-center", collapsed && "justify-center")}>
            <Plane className="h-6 w-6 text-sidebar-accent" />
            {!collapsed && <span className="ml-2 font-bold text-lg">Mibe's Travel</span>}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarHeader>
        
        <SidebarContent className="px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item,index) => (
              
                item.dropdown?
                <DropDown key={index} items={item.dropdown} name={item.name} icon={item?.icon} collapsed={collapsed}/>
                :
              
              <Link 
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  "hover:bg-sidebar-accent/10",
                  location.pathname === item.href 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            
            ))}
          </nav>
        </SidebarContent>
        
        <SidebarFooter className="p-4">
          <div className={cn("flex flex-col gap-2", collapsed && "items-center")}>
            {!collapsed && (
              <div className="flex items-center mb-2">
                <div className="bg-sidebar-accent/20 p-2 rounded-full">
                  <User className="h-6 w-6 text-sidebar-foreground" />
                </div>
                <div className="ml-3">
                  {/* <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p> */}
                  <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={logout} 
              className={cn(
                "border-sidebar-border text-sidebar-foreground",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "w-10 h-10 p-0"
              )}
            >
              <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && "Logout"}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={toggleSidebar} 
              className="lg:flex hidden mt-2"
            >
              {collapsed ? "Expand" : "Collapse"} Sidebar
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile toggle button */}
      <Button 
        variant="outline" 
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-20 lg:hidden",
          !collapsed && "hidden"
        )}
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
};

export default DashboardSidebar;
