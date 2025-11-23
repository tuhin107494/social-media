import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

import FeedNavbar from './FeedNavbar';
import LeftSidebar from './FeedLeftSidebar';


interface FeedProps {
  currentUser: User;
  onLogout: () => void;
}

const Feed: React.FC<FeedProps> = ({ currentUser, onLogout }) => {

    const [users, setUsers] = useState<User[]>([]);

    const events = [
        { id: '1', title: 'Tech Startup Meetup', location: 'Modina Market, Sylhet', date: 'Nov 25', imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx7kSpkDFKydq2-qUOBPiNOra50wSovAwO5OyqzhUx2yMcN2uYveMhGItyvRAUMwo5rtapOY1OHhwT42c8qI_UHxop342w2JH0MFlgfN7-LV-EGm2taxgnukuXNnVMRr4izyvBb=s1360-w1360-h1020-rw' },
        { id: '2', title: 'Tech Contest', location: 'Modina Market, Sylhet', date: 'Nov 28', imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxPkGCOa6Lj_fx6wlFPkxpG1PdKt2KcUFfJQ7IO-YM5cjQssRPqO5tUJHU5WQC9yFUqjBA04ds9BF_gJ_pna-dpJvWEIhMoOXvI3HnF6NLp3sIQpXcWY2eby8uIfjmXkW2HFyNXVeWwDZTD=s1360-w1360-h1020-rw' },
    ];

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
    
      <FeedNavbar currentUser={currentUser} onLogout={onLogout} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
         <div className="flex flex-col lg:flex-row gap-6">
          
          <LeftSidebar users={users} events={events} />

          </div>
        </div>
      
    </div>
  );
};

export default Feed;