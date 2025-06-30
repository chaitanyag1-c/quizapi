class Question < ApplicationRecord
  belongs_to :quizz
  has_many :options
  accepts_nested_attributes_for :options
end
