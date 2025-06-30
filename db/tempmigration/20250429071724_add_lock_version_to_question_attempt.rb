class AddLockVersionToQuestionAttempt < ActiveRecord::Migration[8.0]
  def change
    add_column :question_attempts, :lock_version, :integer
  end
end
