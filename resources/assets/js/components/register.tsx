import React, { useState } from 'react';
import AuthLayout from './authLayouts';

import { User } from '../types';
import { Button, Input } from 'antd';
import { registerUser } from '../auth';
import illustration from '../../images/registration.png';

interface RegisterProps {
  onLogin: (user: User) => void;
  onNavigateToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      const user = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Registration" subtitle="Get Started Now" illustration={illustration}>
      <div className="mb-6">
         <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium">
           <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
           Register with google
         </button>
      </div>

      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="firstName"
            placeholder="First Name" 
             className='!h-12 !mt-4'
            value={formData.firstName} 
            onChange={handleChange}
            required 
          />

          <Input 
            name="lastName"
            placeholder="Last Name" 
            className='!h-12 !mt-4'
            value={formData.lastName} 
            onChange={handleChange}
            required 
          />
        </div>
        <Input 
          name="email"
          placeholder="Email" 
           className='!h-12 !mt-4'
          type="email" 
          value={formData.email} 
          onChange={handleChange}
          required 
        />
        <Input 
          name="password"
          placeholder='Password'
          type="password" 
           className='!h-12 !mt-4'
          value={formData.password} 
          onChange={handleChange}
          required 
        />
        <Input 
          name="confirmPassword"
          placeholder="Confirm Password" 
          type="password" 
             className='!h-12 !mt-4'
          value={formData.confirmPassword} 
          onChange={handleChange}
          required 
        />

        <div className="flex items-center !mt-6 text-sm">
           <label className="flex items-center text-gray-600 cursor-pointer">
              <input type="checkbox" required className="mr-2 rounded border-gray-300 text-primary focus:ring-primary" />
              I agree to terms & conditions
           </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <Button  className='!bg-blue-500 !text-white !mt-4 !h-12 !w-72'  loading={loading}>Register Now</Button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <button type="button" onClick={onNavigateToLogin} className="text-primary font-medium hover:underline text-blue-500">Login now</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;