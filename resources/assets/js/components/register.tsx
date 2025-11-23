import React, { useState } from 'react';
import AuthLayout from './authLayouts';

import { User } from '../types';
import { Button, Input, message, Form } from 'antd';
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
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // clear field error for this field
        setFieldErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        if (formData.password !== formData.confirmPassword) {
            setFieldErrors(prev => ({ ...prev, password_confirmation: 'Passwords do not match' }));
            return;
        }

        setLoading(true);
        try {
            const user = await registerUser({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            });

            message.success('Registration successful. Please login.');
            setTimeout(() => onNavigateToLogin(), 600);
        } catch (err: any) {
            if (err?.errors) {
                const mapped: Record<string, string> = {};
                Object.entries(err.errors).forEach(([k, v]) => {
                    mapped[k] = Array.isArray(v) ? v[0] : (v as string);
                });
                setFieldErrors(mapped);
                setError(err.message || 'Validation error');
            } else {
                setError(err?.message || 'Failed to register');
            }
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
                    <Form.Item
                        validateStatus={fieldErrors.first_name ? 'error' : ''}
                        help={fieldErrors.first_name}
                        className="!mt-4"
                    >
                        <Input
                            name="firstName"
                            placeholder="First Name"
                            className='!h-12'
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Item>

                    <Form.Item
                        validateStatus={fieldErrors.last_name ? 'error' : ''}
                        help={fieldErrors.last_name}
                        className="!mt-4"
                    >
                        <Input
                            name="lastName"
                            placeholder="Last Name"
                            className='!h-12'
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    validateStatus={fieldErrors.email ? 'error' : ''}
                    help={fieldErrors.email}
                    className="!mt-4"
                >
                    <Input
                        name="email"
                        placeholder="Email"
                        className='!h-12'
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Item>
                <Form.Item
                    validateStatus={fieldErrors.password ? 'error' : ''}
                    help={fieldErrors.password}
                    className="!mt-4"
                >
                    <Input
                        name="password"
                        placeholder='Password'
                        type="password"
                        className='!h-12'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Item>
                <Form.Item
                    validateStatus={fieldErrors.password_confirmation ? 'error' : ''}
                    help={fieldErrors.password_confirmation}
                    className="!mt-4"
                >
                    <Input
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        type="password"
                        className='!h-12'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Form.Item>
                

                <div className="flex items-center !mt-6 text-sm">
                    <label className="flex items-center text-gray-600 cursor-pointer">
                        <input type="checkbox" required className="mr-2 rounded border-gray-300 text-primary focus:ring-primary" />
                        I agree to terms & conditions
                    </label>
                </div>

                {Object.keys(fieldErrors).length === 0 && error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <Button
                    className='!bg-blue-500 !text-white !mt-4 !h-12 !w-72'
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Register Now
                </Button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <button type="button" onClick={onNavigateToLogin} className="text-primary font-medium hover:underline text-blue-500">Login now</button>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;