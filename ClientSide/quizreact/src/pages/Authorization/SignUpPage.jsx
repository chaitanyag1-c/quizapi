import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../redux/api/authApi"; // RTK Query Mutation
import { toast } from "react-toastify";

const { Option } = Select;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation(); // RTK Query mutation hook

  const onFinish = async (values) => {
    try {
     const response = await signUp(values).unwrap(); // Call API and wait for response
     toast.success("Signup successful! Please log in.", {
      position: "top-right", // Show toast at top-right
      autoClose: 3000, // Auto close after 3 sec
    });
      console.log(response)
      navigate("/signin"); // Redirect to Sign In Page
    } catch (error) {
      message.error(error?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.signupBox}>
        <div style={styles.logo}>MyQuiz</div>

        {/* Ant Design Form */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
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
              { required: true, message: "Please confirm your password" },
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
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Sign In Link */}
        <div style={styles.authLinks}>
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/signin")} style={styles.authLink}>
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ Improved Styling to Fix Navbar Overlapping Issue
const styles = {
  pageContainer: {
    background: "linear-gradient(to bottom right, #e9f7fc, #ffffff)",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "80px", // ✅ Ensures content does not hide behind navbar
  },
  signupBox: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "450px",
    width: "100%",
    marginTop: "20px", // ✅ Adds extra space
  },
  logo: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: "20px",
  },
  authLinks: {
    marginTop: "20px",
    textAlign: "center",
  },
  authLink: {
    textDecoration: "none",
    fontWeight: "bold",
    color: "#007bff",
    cursor: "pointer",
  },
};

export default SignUpPage;
