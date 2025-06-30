class QuizzController < ApplicationController
  # before_action :ensure_signed_in!

  def new
    @quizz = Quizz.new
    @quizz.questions.build(options: [Option.new, Option.new, Option.new, Option.new])  # Initialize an empty question for the form
  end
  
  def me
    if @current_user
      render json: @current_user
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end


  # def create_bak
  #   @quiz = Quizz.new(quiz_params)
  #   if @quiz.save
  #     redirect_to create_quiz_path, notice: 'Quiz created successfully!'
  #   else
  #     render :new
  #   end
  # end

  def create
    quiz = Quizz.find_or_initialize_by(name: quiz_params[:name])

    if quiz.persisted?
      quiz.assign_attributes(questions_attributes: quiz_params[:questions_attributes])
    else
      quiz.assign_attributes(quiz_params)
    end

    if quiz.save
      flash[:notice] = "Quiz successfully created/updated!"
      redirect_to quizz_path, notice: 'Quiz created successfully!'
    else
      flash.now[:alert] = "Failed to save quiz."
      @quizz = quiz
      render :new
    end
  end

  def questions_by_quiz_id
    question = Question.where(quizz_id: params[:id])
    render json: question
  end

  def question_by_id
    question_id = params[:id]
    q = Question.find(question_id)
    render json: q
  end

  def list_all_quiz_names
    quizzs = Quizz.active
    encrypted = Base64.strict_encode64(quizzs.to_json)
    render json: { encrypted_data: encrypted }
  end

 def quiz_details
  category_id = params[:id]  
  questions = Question.includes(:options, :quizz).where(quizz_id: category_id)

  @formatted_data = questions.map do |question|
    options = question.options.order(:id)

    is_correct_option_1 = options[0]&.is_correct_option || 0
    is_correct_option_2 = options[1]&.is_correct_option || 0
    is_correct_option_3 = options[2]&.is_correct_option || 0
    is_correct_option_4 = options[3]&.is_correct_option || 0

    
    correct_option = if is_correct_option_1 == true
                       options[0]&.content
                     elsif is_correct_option_2 == true
                       options[1]&.content
                     elsif is_correct_option_3 == true
                       options[2]&.content
                     elsif is_correct_option_4 == true
                       options[3]&.content
                     else
                       nil
                     end

    {
      question_id: question.id,
      category: question.quizz.name,
      created_at: question.created_at,
      updated_at: question.updated_at,
      question_text: question.content,
      option_1: options[0]&.content,
      option_2: options[1]&.content,
      option_3: options[2]&.content,
      option_4: options[3]&.content,
      is_correct_option_1: is_correct_option_1,
      is_correct_option_2: is_correct_option_2,
      is_correct_option_3: is_correct_option_3,
      is_correct_option_4: is_correct_option_4,
      correct_option: correct_option
    }
  end

  render json: { quiz_list: @formatted_data }
end


  def edit_question
    @question = Question.find(params[:id])
  end

  def update_question
    @question = Question.find(params[:id])
    if @question.update(question_params)
      redirect_to list_questions_path, notice: 'Question updated successfully.'
    else
      render :edit_, status: :unprocessable_entity
    end
  end

  def lookup
    quiz_names = Quizz.distinct.pluck(:name) # Fetch distinct quiz names
    render json: quiz_names
  end

 def create_question
  ActiveRecord::Base.transaction do
    quiz = Quizz.find(params["quizz"]["id"])
    question = quiz.questions.build(question_params)
     option_params.each do |opt|
      question.options.build(opt)
    end
    question.save!
  end
  render json: { message: 'Question and options successfully created' }, status: :created
rescue ActiveRecord::RecordInvalid => e
  # If any exception occurs (such as validation failure), return an error
  render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
end

def update
  question = Question.find(params[:id])
  if question.update(question_param_mitra)
    render json: { message: 'Question and options updated successfully' }, status: :ok
  else
    render json: { errors: question.errors.full_messages }, status: :unprocessable_entity
  end
end

private

def question_param_mitra
  params.require(:question).permit(
    :id,:content,:trans_flag,
    options_attributes: [:id, :content, :is_correct_option]
  )
end

def question_params
  params.require(:question).permit(:content)  # Now 'question' is a hash with the 'text' key
end


def option_params
  # This returns an array of permitted option hashes
  params.require(:options).map do |opt|
    opt.permit(:content, :is_correct_option)
  end
end
  

  def quiz_params
    params.require(:quizz).permit(
      :name,
      questions_attributes: [:content, 
                             options_attributes: [:content, :is_correct_option]]
    )
  end

  


end
