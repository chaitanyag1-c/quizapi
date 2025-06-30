class QuizAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :quizz
  has_many :question_attempts
end
