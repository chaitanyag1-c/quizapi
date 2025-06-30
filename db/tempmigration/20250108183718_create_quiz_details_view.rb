class CreateQuizDetailsView < ActiveRecord::Migration[8.0]
  def up
    execute <<-SQL
      CREATE VIEW quiz_details AS
      WITH RankedOptions AS (
          SELECT 
              q.name AS QuizName,
              qs.content AS QuestionContent,
              o.content AS OptionContent,
              o.is_correct_option AS IsCorrect,
              ROW_NUMBER() OVER (PARTITION BY qs.id ORDER BY o.id) AS OptionNumber
          FROM 
              quizzs q
          JOIN 
              questions qs ON q.id = qs.quizz_id
          JOIN 
              options o ON qs.id = o.question_id
      )
      SELECT 
          QuizName,
          QuestionContent,
          MAX([1]) AS Option1,
          MAX([2]) AS Option2,
          MAX([3]) AS Option3,
          MAX([4]) AS Option4,
          MAX(CASE WHEN IsCorrect = 1 THEN [1] END) AS CorrectOption
      FROM 
          RankedOptions
      PIVOT (
          MAX(OptionContent)
          FOR OptionNumber IN ([1], [2], [3], [4])
      ) AS PivotedOptions
      GROUP BY 
          QuizName, QuestionContent;
    SQL
  end

  def down
    execute "DROP VIEW IF EXISTS quiz_details;"
  end
end
