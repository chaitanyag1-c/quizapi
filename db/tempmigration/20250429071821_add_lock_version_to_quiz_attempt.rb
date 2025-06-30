class AddLockVersionToQuizAttempt < ActiveRecord::Migration[8.0]
  def change
    add_column :quiz_attempts, :lock_version, :integer
  end
end
