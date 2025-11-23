import React from 'react';
import { User } from '../types';
import { Input, Badge, Avatar, Space, Button } from 'antd';
import { HomeOutlined, UserOutlined, BellOutlined, MessageOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import logo from '../../images/logo.svg';

interface Props {
  currentUser: User;
  onLogout: () => void;
}

const { Search } = Input;

const FeedNavbar: React.FC<Props> = ({ currentUser, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <img src={logo} alt="logo" style={{ height: 28 }} />
            </div>

            <div  className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1 w-100 ml-40">
              <Input
                placeholder="Input Search Text"
                allowClear
                prefix={<SearchOutlined  className='!text-lg !text-gray-500 mr-4'/>}
                className="!rounded-3xl !bg-transparent !border-none !outline-none !text-sm !w-full "
              />
            </div>
           
          </div>

          <div className="flex items-center gap-4">
            <Space size="middle">
              <Button type="text" icon={<HomeOutlined style={{ fontSize: 18 }} />} className="text-primary border-b-2 border-transparent" />
              <Button type="text" icon={<UserOutlined style={{ fontSize: 18 }} />} />

              <Badge count={6} size="small">
                <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
              </Badge>

              <Badge count={2} size="small">
                <Button type="text" icon={<MessageOutlined style={{ fontSize: 18 }} />} />
              </Badge>

              <div className="flex items-center gap-2 border-l pl-4 ml-2 cursor-pointer" onClick={onLogout} title="Logout">
                <Avatar src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}`} />
                <span className="text-sm font-medium hidden md:block text-gray-700">{currentUser.firstName} {currentUser.lastName}</span>
                <Button type="text" icon={<LogoutOutlined />} />
              </div>
            </Space>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FeedNavbar;
