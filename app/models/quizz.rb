class Quizz < ApplicationRecord
	before_save :set_trans_flag
	has_many :questions,dependent: :destroy
	accepts_nested_attributes_for :questions, allow_destroy: true
  scope :active, -> { where(trans_flag: 'A') }

  def set_trans_flag
    if self.new_record?
      self.trans_flag = 'A'
    end
  end
end
