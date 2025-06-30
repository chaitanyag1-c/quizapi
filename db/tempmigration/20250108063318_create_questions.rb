class CreateQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :questions do |t|
      t.references :quizz, null: false, foreign_key: true
      t.text :content

      t.timestamps
    end
  end
end
