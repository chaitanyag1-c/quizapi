import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizQuestions } from '../../redux/slices/quizcategorySlice';
import { Spin, Alert, Card, Radio, Typography, Button, message } from 'antd';
import { useSubmitQuizMutation } from '../../redux/api/quizApi';
import QuizResult from './QuizResult'; // ✅ Import result component

const { Title } = Typography;

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [resultData, setResultData] = useState(null); // ✅ Result state

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { quizquestions, loading, error } = useSelector((state) => state.quizquestion);
  const [submitQuiz, { isLoading: submitting }] = useSubmitQuizMutation();

  // Fetch questions for quiz
  useEffect(() => {
    if (id) {
      dispatch(fetchQuizQuestions(id));
    }
  }, [id, dispatch]);

  // 🔐 Redirect if user not logged in
  useEffect(() => {
    if (!isAuthenticated && !user) {
      message.error("Please login to attempt the quiz.");
      navigate("/signin");
    }
  }, [isAuthenticated, user, navigate]);

  // Option change handler
  const handleOptionChange = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    const unanswered = quizquestions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      message.warning("Please answer all questions before submitting.");
      return;
    }

    const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => {
      const question = quizquestions.find((q) => q.id === parseInt(questionId));
      const option = question?.options.find((opt) => opt.id === selectedOptionId);

      return {
        user_id: user.id,
        quiz_id: id,
        question_id: parseInt(questionId),
        selected_option_id: selectedOptionId,
        selected_option_content: option?.content || "",
      };
    });

    const payload = { answers };

    try {
      const response = await submitQuiz(payload).unwrap();
      message.success("Quiz submitted successfully!");
      setResultData(response.data); // Show results
    } catch (err) {
      console.error("Submission error:", err);
      message.error("Failed to submit quiz.");
    }
  };

  // Loading state
  if (!user || loading || submitting) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }} />;
  }

  // Error state
  if (error) {
    return <Alert message="Error loading quiz questions" description={error} type="error" showIcon />;
  }

  // ✅ Show result after submit
  if (resultData) {
    return <QuizResult result={resultData} />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2}>Quiz ID: {id}</Title>

      {quizquestions && quizquestions.length > 0 ? (
        <>
          {quizquestions.map((question, index) => (
            <Card
              key={question.id}
              title={`${index + 1}. ${question.content}`}
              style={{ marginBottom: '1.5rem' }}
            >
              <Radio.Group
                onChange={(e) => handleOptionChange(question.id, e.target.value)}
                value={selectedAnswers[question.id]}
              >
                {question.options.map((option) => (
                  <Radio key={option.id} value={option.id} style={{ display: 'block', margin: '0.5rem 0' }}>
                    {option.content}
                  </Radio>
                ))}
              </Radio.Group>
            </Card>
          ))}

          <Button type="primary" size="large" style={{ marginTop: '2rem' }} onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </>
      ) : (
        <p>No quiz questions found for this quiz.</p>
      )}
    </div>
  );
};

export default QuizAttempt;
