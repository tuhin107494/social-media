import React, { useState } from 'react';
import AuthLayout from './authLayouts';
import { Button, Input, Form } from 'antd';
import { User } from '../types';
import { loginUser } from '../auth';
import illustration from '../../images/login.png';


interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    
    try {
      const user = await loginUser(email, password);
      onLogin(user);
    } catch (err: any) {
      if (err?.errors) {
        // convert errors object (array of messages) to first-message string per field
        const mapped: Record<string, string> = {};
        Object.entries(err.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : (v as string);
        });
        setFieldErrors(mapped);
        setError(err.message || 'Validation error');
      } else {
        setError(err?.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to your account" subtitle="Welcome back" illustration={illustration}>
      {/* Social Login Mock */}
      <div className="mb-6">
         <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium">
           <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
           Or sign-in with google
         </button>
      </div>

      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <Form.Item
          validateStatus={fieldErrors.email ? 'error' : ''}
          help={fieldErrors.email}
          className="!mt-4"
        >
          <Input
            placeholder="Email"
            type="email"
            className='!h-12'
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev=>({ ...prev, email: undefined })); }}
            required
          />
        </Form.Item>
        <Form.Item
          validateStatus={fieldErrors.password ? 'error' : ''}
          help={fieldErrors.password}
          className="!mt-4"
        >
          <Input
            placeholder="Password"
            type="password"
            className='!h-12'
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev=>({ ...prev, password: undefined })); }}
            required
          />
        </Form.Item>

        {/* <div className="flex items-center justify-between mb-6 text-sm">
           <label className="flex items-center text-gray-600 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-gray-300 text-primary focus:ring-primary" />
              Remember me
           </label>
           <button type="button" className="text-primary hover:underline font-medium">
             Forgot password?
           </button>
        </div> */}

        {Object.keys(fieldErrors).length === 0 && error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <Button  className='!bg-blue-500 !text-white !mt-4 !h-12 !w-72' loading={loading} onClick={handleSubmit}>Login now</Button>

        <p className="text-center text-sm text-gray-600 mt-6 ">
          Dont have an account? <button type="button" onClick={onNavigateToRegister} className="text-primary font-medium hover:underline text-blue-500">Create New Account</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;