import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message,notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { useSignInMutation } from '../../redux/api/authApi';
import toast from 'react-hot-toast';

const SignInPage = () => {
  const navigate = useNavigate();
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
useEffect(() => {
 const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.error(toastMessage);
      sessionStorage.removeItem("toastMessage"); // Clear it after showing
    }   
}, [])

  const onFinish = async (values) => {
    try {
      const response = await signIn(values).unwrap();
      console.log("Signin response:", response); // Debug log

      if (response?.signed_in === true) {
        toast.success(`SignIn Success`);
        notification.success({
          message: 'Signin successful!',
          description: 'Welcome back!',
          placement: 'bottomRight',
          duration: 3, // time in seconds
        });
        dispatch(setUser(response));
        navigate('/');
      } else {
        const errorMessage = response?.message || "Signin failed!";
        toast.error(`SignIn Error: ${response.mesage}`);
        notification.error({
          message: 'Signin Error!',
          description: errorMessage,
          placement: 'bottomRight',
          duration: 3,
        });
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      notification.error({
        message: 'Signin Error!',
        description: error?.data?.message || 'Sign-in failed',
        placement: 'bottomRight',
        duration: 3,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="auth-container p-4 text-center bg-white shadow rounded"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h2 className="auth-title text-primary mb-3">Sign In</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Sign In
          </Button>
        </Form>
        <p className="mt-3">
          Don't have an account?{' '}
          <span
            style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
