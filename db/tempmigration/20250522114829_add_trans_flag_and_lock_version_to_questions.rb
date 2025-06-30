class AddTransFlagAndLockVersionToQuestions < ActiveRecord::Migration[8.0]
  def change
    add_column :questions, :trans_flag, :string, limit: 1
    add_column :questions, :lock_version, :integer, default: 0, null: false
  end
end
