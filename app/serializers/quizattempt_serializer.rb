class QuizattemptSerializer < ActiveModel::Serializer
  attributes :id,:score,:user_id
  has_many :question_attempts, serializer: QuestionAttemptSerializer
end
