require "test_helper"

class QuizzControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get quizz_index_url
    assert_response :success
  end

  test "should get create" do
    get quizz_create_url
    assert_response :success
  end
end
