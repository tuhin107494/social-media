import React from 'react';
import logo from '../../images/logo.svg';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  illustration?: string; // pass imported image path
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, illustration }) => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white w-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch" style={{ maxWidth: 1100, minHeight: 640 }}>

        {/* Left Side - Illustration (visible on md and up) */}
        <div className="hidden md:flex md:flex-1 bg-gray-50 items-center justify-center p-8" style={{ minWidth: 0 }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {illustration ? (
              // illustration passed from consumer
              <img src={illustration} alt="Auth Illustration" style={{ width: '100%', height: 'auto', maxWidth: 720, objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '420px', height: '420px', background: 'transparent' }} />
            )}
          </div>
        </div>

        {/* Right Side - Form (fixed width on md+) */}
        <div className="w-full md:w-[380px] p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-[320px] mx-auto w-full">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <img src={logo} alt="logo" style={{ height: 28 }} />
            </div>

            <div className="mb-6 text-center">
              {subtitle && <p className="text-sm text-gray-500 mb-1">{subtitle}</p>}
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;