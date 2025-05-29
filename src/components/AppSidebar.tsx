
import { useState } from 'react';
import { User, Users, Book, Calendar, LogOut, Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/pages/Index';

interface AppSidebarProps {
  user: UserType;
  onLogout: () => void;
}

export const Sidebar = ({ user, onLogout }: AppSidebarProps) => {
  const { collapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState('dashboard');

  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { id: 'dashboard', title: 'Dashboard', icon: User },
          { id: 'students', title: 'Manage Students', icon: Users },
          { id: 'subjects', title: 'Manage Subjects', icon: Book },
          { id: 'reports', title: 'Attendance Reports', icon: Calendar },
        ];
      case 'faculty':
        return [
          { id: 'dashboard', title: 'Dashboard', icon: User },
          { id: 'attendance', title: 'Mark Attendance', icon: Calendar },
          { id: 'subjects', title: 'My Subjects', icon: Book },
        ];
      case 'student':
        return [
          { id: 'dashboard', title: 'Dashboard', icon: User },
          { id: 'attendance', title: 'My Attendance', icon: Calendar },
          { id: 'subjects', title: 'My Subjects', icon: Book },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar
      className={collapsed ? 'w-14' : 'w-64'}
      collapsible
    >
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Book className="h-8 w-8 text-blue-600" />
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg text-gray-900">UniAttend</h2>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">
            {!collapsed ? 'Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    className={`${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
