import React from 'react';
import { useFetchQuizAttemptListQuery } from '../../redux/api/quizApi';
import { useSelector } from 'react-redux';
import { Spin, Alert, List, Card, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const QuizAttemptList = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading } = useFetchQuizAttemptListQuery(user.id);
    const navigate =  useNavigate()
  const handleDetailClick = (attemptId) =>{
    navigate(`/view_quiz_attempt_details/${attemptId}`)
  }
  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2}>📘 Your Quiz Attempts </Title>

      {isLoading && <Spin size="large" />}
      {error && (
        <Alert
          message="Error loading quiz attempts"
          description={error.message || 'Something went wrong'}
          type="error"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
      )}
    <Button type="default" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
            ← Back
          </Button>
      {data?.data?.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={data.data}
          renderItem={(attempt) => (
            <List.Item>
              <Card title={`Attempt #${attempt.id}`}>
                <p>Score: {attempt.score}</p>
                <p>Completed At: {new Date(attempt.completed_at).toLocaleString()}</p>
                <Button onClick={()=>handleDetailClick(attempt.id)} className='btn btn-primary'>View Details</Button>
              </Card>
              
            </List.Item>
          )}
        />
      ) : (
        !isLoading &&
        !error && (
          <Alert
            message="No attempts found"
            type="info"
            showIcon
            style={{ marginTop: '1rem' }}
          />
        )
      )}
    </div>
  );
};

export default QuizAttemptList;
