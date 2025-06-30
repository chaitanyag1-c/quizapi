import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../../redux/slices/questionSlice";
import { Table, Spin, Alert, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";

const QuizList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questions, loading, error } = useSelector((state) => state.questions);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchQuestions(id));
  }, [dispatch, id]);

  const columns = [
    {
      title: "Question ID",
      dataIndex: "question_id",
      key: "question_id",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Question",
      dataIndex: "question_text",
      key: "question_text",
    },
    {
      title: "Option 1",
      dataIndex: "option_1",
      key: "option_1",
    },
    {
      title: "Option 2",
      dataIndex: "option_2",
      key: "option_2",
    },
    {
      title: "Option 3",
      dataIndex: "option_3",
      key: "option_3",
    },
    {
      title: "Option 4",
      dataIndex: "option_4",
      key: "option_4",
    },
    {
      title: "Correct Answer",
      dataIndex: "correct_option",
      key: "correct_option",
      render: (text) => <b style={{ color: "green" }}>{text}</b>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/edit_question/${record.question_id}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Back Button */}
      <Button
        type="default"
        onClick={() => navigate("/show_quiz_category")}
        style={{ marginBottom: "1rem" }}
      >
        🔙Back to Categories
      </Button>

      {loading && <Spin size="large" />}
      {error && <Alert message={error} type="error" showIcon />}
      {!loading && questions && (
        <Table
          columns={columns}
          dataSource={questions}
          rowKey="question_id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default QuizList;
