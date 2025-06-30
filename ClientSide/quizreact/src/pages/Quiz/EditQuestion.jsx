import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useEditQuestionQuery,
  useSaveEditedQuestionMutation,
} from "../../redux/api/quizApi";
import { Select } from "antd";

import {
  Form,
  Input,
  Button,
  Radio,
  Spin,
  Alert,
  Card,
  Typography,
  Space,
  message,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { Title } = Typography;

const EditQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useEditQuestionQuery(questionId);
  const [saveEditedQuestion] = useSaveEditedQuestionMutation();

  const [form] = Form.useForm();
  const [correctOption, setCorrectOption] = useState(null);
  const [optionIds, setOptionIds] = useState([]);

  useEffect(() => {
    if (data) {
      const { content,trans_flag, options } = data;
      const correctIndex = options.findIndex((opt) => opt.is_correct_option);
      setCorrectOption(correctIndex + 1);
      setOptionIds(options.map((opt) => opt.id));
      form.setFieldsValue({
        question_text: content,
        trans_flag: trans_flag || "A",
        option_1: options[0]?.content,
        option_2: options[1]?.content,
        option_3: options[2]?.content,
        option_4: options[3]?.content,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values) => {
    const payload = {
      question: {
        id: questionId,
        content: values.question_text,
        trans_flag:values.trans_flag,
        options_attributes: [1, 2, 3, 4].map((num, idx) => ({
          id: optionIds[idx],
          content: values[`option_${num}`],
          is_correct_option: correctOption === num,
        })),
      },
    };
    console.log(questionId)
    try {
      await saveEditedQuestion({ questionId, data: payload }).unwrap();
      toast.success("Question updated successfully!");
       navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update question.");
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Error loading question"
        description="Please try again later."
        showIcon
        style={{ marginTop: "2rem" }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "3rem auto" }}>
      <Card bordered hoverable style={{ borderRadius: 10 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Title level={3} style={{ textAlign: "center" }}>
            Edit Quiz Question
          </Title>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Question"
              name="question_text"
              rules={[{ required: true, message: "Please enter the question" }]}
            >
              <Input placeholder="Enter the question" />
            </Form.Item>

                    <Form.Item
          label="Status"
          name="trans_flag"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="A">Active</Select.Option>
            <Select.Option value="D">Delete</Select.Option>
          </Select>
        </Form.Item>


            <Radio.Group
              onChange={(e) => setCorrectOption(e.target.value)}
              value={correctOption}
              style={{ width: "100%" }}
            >
              {[1, 2, 3, 4].map((num) => (
                <Form.Item
                  key={num}
                  label={false}
                  required
                  style={{ marginBottom: "1.2rem" }}
                >
                  <Row gutter={10} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        name={`option_${num}`}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: `Option ${num} is required`,
                          },
                        ]}
                      >
                        <Input placeholder={`Option ${num}`} />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Radio value={num}>Correct</Radio>
                    </Col>
                  </Row>
                </Form.Item>
              ))}
            </Radio.Group>

            <Button type="primary" htmlType="submit" block>
              Update Question
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default EditQuestion;
