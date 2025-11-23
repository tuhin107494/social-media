import React from 'react';
import { User } from '../types';
import { Search, Home, Users, Bell, MessageSquare, LogOut } from 'lucide-react';
import logo from '../../images/logo.svg';
interface Props {
  currentUser: User;
  onLogout: () => void;
}

const FeedNavbar: React.FC<Props> = ({ currentUser, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <span className="text-xl font-bold text-primary"><img src={logo} alt="logo" style={{ height: 28 }} /></span>
            </div>
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input type="text" placeholder="Input search text" className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 text-primary border-b-2 border-primary"><Home className="w-5 h-5" /></button>
            <button className="p-2 text-gray-500 hover:text-primary"><Users className="w-5 h-5" /></button>
            <div className="relative">
               <button className="p-2 text-gray-500 hover:text-primary"><Bell className="w-5 h-5" /></button>
               <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">6</span>
            </div>
            <div className="relative">
               <button className="p-2 text-gray-500 hover:text-primary"><MessageSquare className="w-5 h-5" /></button>
               <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer border-l pl-4 ml-2" onClick={onLogout} title="Logout">
              <img 
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium hidden md:block text-gray-700">{currentUser.firstName} {currentUser.lastName}</span>
              <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FeedNavbar;
