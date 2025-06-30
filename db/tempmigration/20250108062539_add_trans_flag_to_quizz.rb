class AddTransFlagToQuizz < ActiveRecord::Migration[8.0]
  def change
    add_column :quizzs, :trans_flag, :string
  end
end
