# app/serializers/option_serializer.rb
class OptionSerializer < ActiveModel::Serializer
  attributes :id, :content, :is_correct_option
end
