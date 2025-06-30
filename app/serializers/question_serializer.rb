class QuestionSerializer < ActiveModel::Serializer
  attributes :id,:content,:trans_flag
  has_many :options
end
