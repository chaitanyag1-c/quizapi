import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchAttemptDetailsQuery } from '../../redux/api/quizApi';
import { Card, Tag, Typography, Spin, Alert, Button } from 'antd';

const { Title, Paragraph } = Typography;

const QuizAttemptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { error, isLoading, data: attemptDetails } = useFetchAttemptDetailsQuery(id);

  if (isLoading) return <Spin tip="Loading attempt details..." size="large" />;
  if (error) return <Alert message="Error fetching attempt details" type="error" showIcon />;

  return (
    <div style={{ padding: '2rem' }}>
      <Button type="default" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        ← Back
      </Button>

      <Title level={3}>📋 Attempt Details</Title>

      {attemptDetails?.data?.question_attempts?.map((qa, idx) => {
        const isCorrect = qa.is_correct;

        return (
          <Card
            key={qa.id}
            title={`Q${idx + 1}: ${qa.question_content}`}
            style={{
              marginBottom: '1rem',
              borderLeft: `6px solid ${isCorrect ? '#52c41a' : '#f5222d'}`,
              backgroundColor: '#fafafa',
            }}
          >
            {qa.options?.map((opt) => {
              const isUserAnswer = opt.content === qa.selected_option;
              const isRightAnswer = opt.is_correct_option;

              return (
                <Paragraph
                  key={opt.id}
                  style={{
                    color:
                      isRightAnswer
                        ? '#52c41a'
                        : isUserAnswer && !isCorrect
                        ? '#f5222d'
                        : 'inherit',
                    fontWeight: isUserAnswer ? 'bold' : 'normal',
                  }}
                >
                  • {opt.content}{' '}
                  {isRightAnswer && (
                    <Tag color="green" style={{ marginLeft: '0.5rem' }}>
                      ✅ Correct Answer
                    </Tag>
                  )}
                  {isUserAnswer && (
                    <Tag color={isCorrect ? 'green' : 'red'} style={{ marginLeft: '0.5rem' }}>
                      {isCorrect ? '✅ Your Answer' : '❌ Your Answer'}
                    </Tag>
                  )}
                </Paragraph>
              );
            })}
          </Card>
        );
      })}
    </div>
  );
};

export default QuizAttemptDetails;
