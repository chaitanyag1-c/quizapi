import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchUserDetailsQuery } from '../../redux/api/userApi';
import {
  Alert,
  Spin,
  Button,
  Form,
  Input,
  Card,
  Typography,
  Divider,
  Select,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {  Descriptions, Tag } from 'antd';
import { UserOutlined, ClockCircleOutlined, IdcardOutlined } from '@ant-design/icons';
import { useUserUpdateMutation } from '../../redux/api/authApi';
import toast from 'react-hot-toast';
const { Title, Text } = Typography;

const ShowUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data, error, isLoading } = useFetchUserDetailsQuery(id);
  const [userUpdate] = useUserUpdateMutation()
  const [userId,setUserId] = useState(0)
  useEffect(() => {
    if (data) {
      setUserId(data.id)
      const { email, first_name, last_name, role, username } = data;
      form.setFieldsValue({ email, first_name, last_name, role, username });
    }
  }, [data, form]);


 const onFinish = async (values) => {
    console.log(userId)
    const payload = {
      user: values,
    };
    console.log(payload);
    try {
        await userUpdate({ userId, data: payload }).unwrap(); // calling RTK mutation
        toast.success("User updated successfully!");
        navigate(0);
    } 
    catch (err) 
    {
        console.error("Update error:", err);
        toast.error("Failed to update user.");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error loading user"
        description={error.message || 'Something went wrong'}
        type="error"
        showIcon
        style={{ margin: '2rem' }}
      />
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} type="link" onClick={() => navigate(-1)}>
        Back
      </Button>


     <Card
  bordered={false}
  style={{
    margin: '1rem 0',
    background: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  }}
>
  <Descriptions
    title="User Metadata"
    layout="horizontal"
    column={1}
    label={{ fontWeight: 'bold', color: '#555' }}
    content={{ color: '#222' }}
  >
    <Descriptions.Item label={<><IdcardOutlined /> User ID</>}>
      <Tag color="blue">{data?.id}</Tag>
    </Descriptions.Item>

    <Descriptions.Item label={<><ClockCircleOutlined /> Created At</>}>
      {dayjs(data?.created_at).format('DD MMM YYYY, hh:mm A')}
    </Descriptions.Item>

    <Descriptions.Item label={<><UserOutlined /> Last Sign In</>}>
      {dayjs(data?.last_sign_in_at).format('DD MMM YYYY, hh:mm A')}
    </Descriptions.Item>
  </Descriptions>
</Card>

      <Divider orientation="left">Edit User Info</Divider>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password"
        rules={[
                      { required: false, message: "Please enter your password" },
                      { min: 6, message: "Password must be at least 6 characters" },
                    ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
         <Form.Item
                    label="Confirm Password"
                    name="password_confirmation"
                    dependencies={["password"]}
                    rules={[
                      { required: false, message: "Please confirm your password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Passwords do not match"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm your password" />
                  </Form.Item>

        <Form.Item label="First Name" name="first_name">
          <Input />
        </Form.Item>

        <Form.Item label="Last Name" name="last_name">
          <Input />
        </Form.Item>

        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>

         <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select Role">
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>
          </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Info
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShowUser;
