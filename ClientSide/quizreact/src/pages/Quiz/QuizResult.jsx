import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Spin, Tag } from 'antd';
import { useLazyFetchAttemptDetailsQuery } from '../../redux/api/quizApi';

const { Title, Paragraph } = Typography;

const QuizResult = ({ result }) => {
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [triggerFetch, { data: attemptDetails, isLoading }] = useLazyFetchAttemptDetailsQuery();

  const toggleAttemptDetails = () => {
    if (!showDetails && result?.id) {
      triggerFetch(result.id);
    }
    setShowDetails((prev) => !prev);
  };

  useEffect(() => {
    if (result?.question_attempts) {
      setTotalQuestion(result.question_attempts.length);
    }
  }, [result]);

  return (
    <div style={{ padding: '2rem' }}>
      <Card>
        <Title level={2}>🎉 Quiz Submitted Successfully!</Title>
        <Paragraph>
          Score: {result?.score} / {totalQuestion}{' '}
          {parseInt(result?.score) > 2 ? '😎' : '☹️'}
        </Paragraph>
        <Paragraph>Attempt ID: {result?.id}</Paragraph>

        <Button
          type="primary"
          size="large"
          style={{ marginTop: '1rem' }}
          onClick={toggleAttemptDetails}
        >
          {showDetails ? 'Hide Attempt Details' : 'View Attempt Details'}
        </Button>

        {isLoading && <Spin style={{ marginTop: '1rem' }} />}

        {showDetails && attemptDetails?.data?.question_attempts?.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <Title level={4}>📋 Attempt Details</Title>

            {attemptDetails.data.question_attempts.map((qa, idx) => {
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
                          color: isRightAnswer
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
        )}
      </Card>
    </div>
  );
};

export default QuizResult;
