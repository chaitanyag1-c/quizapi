class RegistrationController < ApplicationController
  skip_before_action :authenticate_request ,:only=>[:create,:update,:index,:crash,:rash]  
  def index
  cat =  UsernameGenerator.generate("Chaitanya", "Kulkarni", 101)
    @user = User.new
  end


def crash
  raise "Eroriaai Intentional failure error"
end

def rash
  id = params[:id]
  render json: {success: "Radhe Radhe",value: id}
end


def create
  @user = User.new(has_secure_params)

  if @user.save
    flash[:success] = "User created successfully! Please Sign In"
    render json: {user: @user.as_json(only: [:id, :email,:first_name,:last_name])}
  else
    render json: {error: @user.errors.full_messages.join(", ")}
  end
end

def show
  id = params[:id]
  user = User.find(id)
  if user
    render json: user,status: :ok
  else
    render json: {"error":"User not found"},status: :bad_request
  end
end

def update
  byebug
  id = params[:id]
  user = User.find(id)
  if user
    if user.update(user_params)
      render json: user,status: :ok
    else
      render json: "Some error occured",status: :bad_request
    end
  else
    render json: {"error":"User not found"},status: :bad_request
  end
end


  private
  def has_secure_params
    params.require(:registration).permit(:first_name, :last_name, :username, :email, :password, :password_confirmation, :role)
  end

def user_params
  params.require(:user).permit(
    :email,:first_name,:last_name,:username,:role
  )
end

end
