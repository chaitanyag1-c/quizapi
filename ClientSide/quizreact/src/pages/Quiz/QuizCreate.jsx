import React, { useState } from 'react';
import {
  Modal,
  Input,
  Button,
  List,
  Card,
  Typography,
  Spin,
  Row,
  Col,
  Divider,
} from 'antd';
import { SearchOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { useLazyFetchQuizCategoryListQuery,useCreateQuestionMutation } from '../../redux/api/quizApi';
import { toast } from 'react-hot-toast';

const { Title, Text } = Typography;


const QuizCreate = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [categoryId,setCategoryId] =  useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(null); // index 0-3
  const [createQuestion] = useCreateQuestionMutation();
  const [fetchQuizNames, { isLoading, data: apiData, error }] = useLazyFetchQuizCategoryListQuery();

  const openModal = () => {
    setIsModalVisible(true);
    fetchQuizNames();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleOk = () => {
    if (selectedItem) {
      setCategoryId(selectedItem.id)
      setInputValue(selectedItem.name);
      toast.success(`Selected category: ${selectedItem.name}`);
    }
    closeModal();
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!inputValue) {
      toast.error('Please select a category.');
      return;
    }
    if (!questionText.trim()) {
      toast.error('Please enter the question.');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      toast.error('All 4 options must be filled.');
      return;
    }
    if (correctAnswer === null) {
      toast.error('Please select the correct answer.');
      return;
    }
    const formattedOptions = options.map((text, index) => ({
        content: text,
        is_correct_option: index === correctAnswer,
      }));

  
    const payload = {
      quizz: { name: inputValue, id: categoryId },
      question: {
        content: questionText, // Now the question is an object with a 'text' key
      },
      options: formattedOptions,  // Assuming formatted options are already structured
      correct_answer_index: correctAnswer,
    };
    console.log('✅ Submitted payload:', payload);
    createQuestion(payload)
  .unwrap()
  .then((res) => {
    toast.success(res.message);
    // Reset form if needed
    resetValues()
  })
  .catch((err) => {
    toast.error(err?.data?.errors?.join(', ') || 'Failed to submit question');
  });

    //
  };

  const resetValues= ()=>
  {
    setInputValue('');
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(null);
    setSelectedItem(null);
  }

  const filteredData = apiData?.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <Card
        style={{
          maxWidth: 800,
          margin: '0 auto',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Title level={3}>🛠️ Create a New Quiz</Title>

        <Divider />

        {/* Category */}
        <Row gutter={[16, 16]} align="middle">
          <Col span={6}>
            <Text strong>Category:</Text>
          </Col>
          <Col span={12}>
            <Input
              placeholder="Select a category"
              value={inputValue}
              readOnly
            />
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={openModal}
              block
            >
              Lookup
            </Button>
          </Col>
        </Row>

        {/* Question */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Text strong>Question:</Text>
            <Input.TextArea
              placeholder="Enter your question here"
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </Col>
        </Row>

        <Divider />

        {/* Options with radio for correct answer */}
        <Row gutter={[16, 16]}>
          {options.map((option, index) => (
            <Col span={12} key={index}>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                addonBefore={
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === index}
                    onChange={() => setCorrectAnswer(index)}
                    style={{ marginRight: 4 }}
                  />
                }
              />
            </Col>
          ))}
        </Row>

        <Divider />

        {/* Submit button */}
        <Row justify="end">
          <Col>
            <Button type="primary" onClick={handleSubmit}>
              Submit Question
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Category Modal */}
      <Modal
        title="🔍 Choose a Quiz Category"
        open={isModalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            disabled={!selectedItem}
          >
            Confirm
          </Button>,
        ]}
        width={650}
        centered
        styles={{ padding: '1rem 1.5rem' }}
      >
        <Input
          placeholder="Search by name..."
          value={searchText}
          onChange={handleSearch}
          style={{ marginBottom: '1rem' }}
        />

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Text type="danger">
            ⚠️ {error.message || 'Failed to fetch quiz names'}
          </Text>
        ) : (
          <List
            dataSource={filteredData}
            bordered={false}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => handleSelectItem(item)}
                style={{
                  cursor: 'pointer',
                  background:
                    selectedItem?.id === item.id ? '#f6ffed' : '#fff',
                  border:
                    selectedItem?.id === item.id
                      ? '1px solid #52c41a'
                      : '1px solid #f0f0f0',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  boxShadow:
                    selectedItem?.id === item.id
                      ? '0 0 10px #b7eb8f'
                      : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <Card
                  title={<Text strong>{item.name}</Text>}
                  bordered={false}
                  style={{ width: '100%' }}
                  extra={
                    selectedItem?.id === item.id && (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    )
                  }
                >
                  <Text type="secondary">
                    {item.description || 'No description available'}
                  </Text>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default QuizCreate;
