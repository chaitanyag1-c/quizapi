class QuizAttemptsController < ApplicationController
  # before_action :ensure_signed_in!
  before_action :set_quiz, only: [:new]
  before_action :set_quiz_attempt, only: [:show, :submit] 

  def new
    @quiz_attempt = QuizAttempt.new(quizz: @quizz, user: current_user)

    if @quiz_attempt.save
      redirect_to quiz_attempt_path(@quiz_attempt)
    else
      redirect_to quizzes_path, alert: "Failed to start the quiz. Please try again."
    end
  end

  # Action to show the quiz questions for a particular attempt
  def show
    @questions = @quiz_attempt.quizz.questions.includes(:options)
  end

  def view_all_quiz_attempts
  	 @quiz_attempts = QuizAttempt.where(user_id: current_user.id).where.not(score: nil)
  end

  # Action to handle quiz submission
  def submit
    ActiveRecord::Base.transaction do
      score = 0
      params[:answers].each do |question_id, selected_option|
        question_attempt = @quiz_attempt.question_attempts.find_or_initialize_by(question_id: question_id)
        question = Question.find(question_id)
        question_attempt.selected_option = selected_option
        question_attempt.is_correct = question.options.find_by(content: selected_option)&.is_correct_option
        score += 1 if question_attempt.is_correct == true
        question_attempt.save!
      end

      # Mark the quiz attempt as completed and save
      @quiz_attempt.completed_at = Time.current
      @quiz_attempt.score = score
      @quiz_attempt.save!
    end
    redirect_to show_quiz_result_path(@quiz_attempt)
  rescue ActiveRecord::RecordInvalid => e
    redirect_to quiz_attempt_path(@quiz_attempt), alert: "Failed to submit quiz: #{e.message}"
  end

  def submit_quiz_react
    begin
    ActiveRecord::Base.transaction do
      a = QuizAttempt.new
      a.user_id =  params[:answers][0]["user_id"]
      a.quizz_id =  params[:answers][0]["quiz_id"]
      a.save!
      score = 0
      params[:answers].each{|answer|
        question_attempt =  QuestionAttempt.new
        question_attempt.quiz_attempt_id = a.id
        question_attempt.question_id = answer["question_id"]
        question_attempt.selected_option = answer["selected_option_content"]
        option =  Option.where(:question_id => answer["question_id"] ,:content => answer["selected_option_content"] )
        if option.first.is_correct_option == true 
          value = 1 
          score += 1
        else
          value = 0  
        end
        question_attempt.is_correct = value

        question_attempt.save!
      }
      a.update!(:score => score,:completed_at =>Time.now)
      render json: {
        result: "success",
        message: "Quiz submitted successfully",
        data: ActiveModelSerializers::SerializableResource.new(
          a,serializer: QuizattemptSerializer)
        }
    end
    rescue ActiveRecord::RecordInvalid => e
      render json: {result: 'Failed',message: e}
    end
  end

# app/controllers/quiz_attempts_controller.rb
def get_quiz_results
  quiz_attempt = QuizAttempt.find(params[:id])

  # Construct the response manually
  result_data = {
    id: quiz_attempt.id,
    score: quiz_attempt.score,
    user_id: quiz_attempt.user_id,
    question_attempts: quiz_attempt.question_attempts.map do |question_attempt|
      question = question_attempt.question
      options = question.options.map do |option|
        {
          id: option.id,
          content: option.content,
          is_correct_option: option.is_correct_option
        }
      end

      {
        id: question_attempt.id,
        question_id: question.id,
        selected_option: question_attempt.selected_option,
        is_correct: question_attempt.is_correct,
        question_content: question.content,
        options: options
      }
    end
  }

  render json: { result: 'success', message: 'Fetched quiz results', data: result_data }
end

def view_all_attempts
  attempts = QuizAttempt.where(user_id: params[:user_id]).select(:id, :completed_at, :score).order(id: :desc)
  render json: {data: attempts}
end




  def show_quiz_result
  	quiz_attempted = QuizAttempt.find(params[:id])
  	@formatted_data = quiz_attempted.question_attempts.map do |question_attempt|
  		question = Question.find(question_attempt.question_id)
  		correct_option = question.options.correct
  		{
  			question: question.content,
  			correct_option: correct_option.first.content,
  			selected_option: question_attempt.selected_option,
  			score: quiz_attempted.score,
  			completed_at: quiz_attempted.completed_at
  		}
  	end
  	 puts @formatted_data.to_json
  end

  private

  def set_quiz
    @quizz = Quizz.find(params[:quiz_id])
  end

  def set_quiz_attempt
    @quiz_attempt = QuizAttempt.find(params[:id])
  end
end
