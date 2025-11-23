import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

import FeedNavbar from './FeedNavbar';


interface FeedProps {
  currentUser: User;
  onLogout: () => void;
}

const Feed: React.FC<FeedProps> = ({ currentUser, onLogout }) => {
 

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
    
      <FeedNavbar currentUser={currentUser} onLogout={onLogout} />

      
    </div>
  );
};

export default Feed;