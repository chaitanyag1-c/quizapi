import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizCategory } from '../../redux/slices/quizcategorySlice';
import { Spin, Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const QuizCategoryEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🟡 Using existing state key: quizcategory
  const { quizcategorys, loading, error } = useSelector((state) => state.quizcategory);

  useEffect(() => {
    dispatch(fetchQuizCategory());
  }, [dispatch]);

  const handleClick = (quizId) => {

    navigate(`/list_all_questions/${quizId}`); 
   // navigate(`/take_quiz/${quizId}`); // ✅ Adjust route if needed
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem' }}>
      {/* 🟢 Loading Spinner */}
      {loading && <Spin size="large" />}

      {/* 🔴 Error Message */}
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '1rem' }} />}

      {/* 🟡 Quiz Buttons */}
      <h1>Select a QUIZ CATEGORY</h1> <br/><br/>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
      
        {quizcategorys && quizcategorys.length > 0 ? (
          
          quizcategorys.map((quiz) => (
            <Button
              key={quiz.id}
              type="primary"
              shape="round"
              size="large"
              onClick={() => handleClick(quiz.id)}
              style={{
                width: 220,
                height: 60,
                fontSize: '1rem',
                textTransform: 'capitalize',
              }}
            >
              {quiz.name}
            </Button>
          ))
        ) : (
          !loading && <p>No quizzes found.</p>
        )}
      </div>
    </div>
  );
};

export default QuizCategoryEdit;
