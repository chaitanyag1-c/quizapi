import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col } from "antd";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const cards = [
    {
      title: "✍ Create Quiz",
      desc: "Create a new quiz",
      action: () => navigate("/create_quiz"),
      show: isAuthenticated && isAdmin,
    },
    {
      title: "✍ Edit Quiz",
      desc: "Edit a quiz question",
      action: () => navigate("/show_quiz_category"),
      show: isAuthenticated && isAdmin,
    },
    {
      title: "🧠 Take Quiz",
      desc: "Jump into a quiz and test your knowledge.",
      action: () => navigate("/list_quiz_category"),
      show: isAuthenticated,
    },
    {
      title: "📊 View Attempts",
      desc: "See your previous quiz attempts.",
      action: () => navigate("/view_attempts"),
      show: isAuthenticated,
    },
    {
      title: "🧾 Account Information",
      desc: "View your account Information",
      action: () => navigate(`/user/${user.id}`),
      show: isAuthenticated,
    },
    {
      title: "🚪 Log Out",
      desc: "Log out of your account securely.",
      action: handleLogOut,
      show: isAuthenticated,
    },
    {
      title: "🔐 Sign In",
      desc: "Access your account.",
      action: () => navigate("/signin"),
      show: !isAuthenticated,
    },
    {
      title: "📝 Sign Up",
      desc: "Create a new account to get started.",
      action: () => navigate("/signup"),
      show: !isAuthenticated,
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center text-primary">
        Welcome to MyQuiz {user?.first_name && `, ${user.first_name} Ji`} 👋
      </h2>
      <Row gutter={[16, 16]}>
        {cards
          .filter((card) => card.show)
          .map((card, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                title={card.title}
                bordered
                hoverable
                onClick={card.action}
                style={{ cursor: "pointer", height: "100%" }}
              >
                <p>{card.desc}</p>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default HomePage;
