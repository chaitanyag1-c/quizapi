class Option < ApplicationRecord
  belongs_to :question
  scope :correct, -> { where(is_correct_option: true) }

  def is_correct?
    is_correct_option == true
  end
end
