class SessionController < ApplicationController
  skip_before_action :authenticate_request
  def index

  end

  def auth_login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { auth_token: token, user: user,signed_in: true }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

def create
  user = User.find_by(email: params[:email])
  if user&.authenticate(params[:password])
    sign_in(user)
    user.update(last_sign_in_at: Time.current)
    render json: { signed_in: true, user: user.as_json }
    # flash[:notice] = "Welcome back, #{user.first_name}!"
    # redirect_to root_path
  else
    if user.nil?
      render json: { signed_in: false, mesage: "No account found with the email address provided." }
    else
      render json: { signed_in: false, mesage: "Incorrect password. Please try again."}
    end
  end
end

  def destroy
    sign_out
    redirect_to root_path
  end
end
