class CreateQuizAttempts < ActiveRecord::Migration[8.0]
  def change
    create_table :quiz_attempts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :quizz, null: false, foreign_key: true
      t.integer :score
      t.datetime :completed_at

      t.timestamps
    end
  end
end
