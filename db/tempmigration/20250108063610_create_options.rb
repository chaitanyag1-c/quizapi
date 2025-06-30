class CreateOptions < ActiveRecord::Migration[8.0]
  def change
    create_table :options do |t|
      t.string :content
      t.references :question, null: false, foreign_key: true
      t.boolean :is_correct_option

      t.timestamps
    end
  end
end
