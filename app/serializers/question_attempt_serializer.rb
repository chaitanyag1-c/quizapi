class QuestionAttemptSerializer < ActiveModel::Serializer
  attributes :id, :question_id, :selected_option, :is_correct

  belongs_to :question, serializer: QuestionSerializer
end
