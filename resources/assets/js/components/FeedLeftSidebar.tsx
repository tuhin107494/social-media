import React from 'react';
import { User } from '../types';
import { PlayCircle, BarChart2, Users, BookMarked, Gamepad2, Settings, FileBox, MapPin, Search } from 'lucide-react';

interface EventItem { id: string; title: string; location: string; date: string; imageUrl: string }

const LeftSidebar: React.FC<{ users: User[]; events: EventItem[] }> = ({ users, events }) => {
  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h6 className="!font-bold text-gray-900 mb-4 text-lg">Explore</h6>
        <ul className="!ml-[-50px]">
          {[
            { icon: <PlayCircle className="w-5 h-5" />, label: 'Learning', badge: 'New', color: 'text-green-500' },
            { icon: <BarChart2 className="w-5 h-5" />, label: 'Insights' },
            { icon: <Users className="w-5 h-5" />, label: 'Find friends' },
            { icon: <BookMarked className="w-5 h-5" />, label: 'Bookmarks' },
            { icon: <Users className="w-5 h-5" />, label: 'Group' },
            { icon: <Gamepad2 className="w-5 h-5" />, label: 'Gaming', badge: 'New', color: 'text-green-500' },
            { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
            { icon: <FileBox className="w-5 h-5" />, label: 'Save post' },
          ].map((item, idx) => (
            <li key={idx} className='!ml-0'>
              <button className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50`}>
                <div className="flex items-center">
                  <span className="!ml-0 !mr-3 text-gray-500">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-600`}>{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
         <div className="flex justify-between items-center mb-4">
          <h6 className="!font-bold text-gray-900">Suggested People</h6>
          <button className="text-xs text-primary">See All</button>
         </div>
         <div className="space-y-4">
            {users.slice(0,3).map(u => (
              <div key={u.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-200" alt=""/>
                    <div className="overflow-hidden">
                       <p className="text-sm font-bold truncate w-24">{u.firstName} {u.lastName}</p>
                       <p className="text-xs text-gray-500 truncate">User</p>
                    </div>
                 </div>
                 <button className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 text-gray-600">Connect</button>
              </div>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
         <div className="flex justify-between items-center mb-4">
          <h6 className="!font-bold text-gray-900">Events</h6>
          <button className="text-xs text-primary font-medium">See all</button>
         </div>
         <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="group cursor-pointer">
                 <div className="relative rounded-lg overflow-hidden mb-2 h-24">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-center shadow-sm">
                       <span className="block text-[10px] font-bold text-gray-500">{event.date.split(' ')[0]}</span>
                       <span className="block text-xs font-bold text-gray-900">{event.date.split(' ')[1]}</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-start">
                   <div>
                      <h6 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">{event.title}</h6>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </p>
                   </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
