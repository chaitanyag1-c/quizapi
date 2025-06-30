class ApplicationController < ActionController::Base
  include ActionController::Cookies
  #before_action :authenticate_user
  #protect_from_forgery with: :null_session
  before_action :authenticate_request
  skip_before_action :verify_authenticity_token

  def authenticate_request
    token = extract_token_from_header
    return render_unauthorized('Missing or invalid Authorization header') unless token

    decoded_token = JsonWebToken.decode(token)
    return render_unauthorized('Invalid token') unless decoded_token

    @current_user = User.find_by(id: decoded_token[:user_id])
    return render_unauthorized('User not found') unless @current_user
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    render_unauthorized("Token error: #{e.message}")
  end

  private

  def ensure_signed_in!
    redirect_to root_path unless current_user
  end
  
  def current_user
    @current_user
  end

  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil if auth_header.blank? || !auth_header.start_with?('Bearer ')
    auth_header.split(' ').last
  end

  def render_unauthorized(message)
    render json: { error: message }, status: :unauthorized
  end

  def cors_preflight_check
    headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization'
    head :ok
  end

  def authenticate_user
    if cookies.signed[:user_id]
      @current_user ||= User.find_by(id: cookies.signed[:user_id])
    end
    if @current_user

    else
      render json: { error: 'Unauthorized access.Please Login' }, status: :unauthorized
    end
  end

  helper_method :current_user, :logged_in?, :is_admin?

  def sign_in(user)
    session[:user_id] = user.id
    cookies.signed[:user_id] = { value: user.id, expires: 1.hour.from_now }
  end

  def sign_out
    session[:user_id] = nil
    cookies.delete(:user_id) 
  end

  def logged_in?
    current_user.present?
  end

  def is_admin?
    current_user.role == 'Admin'
  end

end
