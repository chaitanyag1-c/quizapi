Rails.application.routes.draw do
  get "quizz/index"
  get "quizz/create"
  get "pages/home"
  get "session/index"
  get "session/create"
  get "session/destroy"
  get "registration/index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  match '*path', to: 'application#cors_preflight_check', via: [:options]
  get "up" => "rails/health#show", as: :rails_health_check
  
  #Login and register Authentication
  get "/registration" => 'registration#index',as: "signup"
  post "/registration" => 'registration#create',as: "user_post"
  get "/login" => 'session#index',as: "login"
  get "/logout" => 'session#destroy',as: "logout"
  post "/sign_in" => 'session#create' ,as:"sign_in"
  post "/auth_login"=> 'session#auth_login'
  get "/me"=> "quizz#me"
  get "/show_user/:id"=> "registration#show"
  patch "/user/update/:id"=> "registration#update"
  get "/crash" => "registration#crash"
  get "/rash/:id" => "registration#rash"

  #Quiz and Question Create
  get "/create_quiz" => 'quizz#new' ,as:"quizz"
  post "/save_quiz" => 'quizz#create' ,as:"quizzes"
  get "/quizzes/lookup" => 'quizz#lookup', as: "quiz_lookup"
  get "/list_questions/:id" => "quizz#quiz_details" ,as:"list_questions"
  get "/list_all_quiz_names" => 'quizz#list_all_quiz_names',as: "list_all_quiz_names"
  get "/edit_question/:id" => 'quizz#edit_question',as: "edit_question"
  patch "/update_question/:id" => 'quizz#update_question',as: "update_question"


  get "fetch_quiz_questions/:id" => 'quizz#questions_by_quiz_id'
  post "submit_quiz" => 'quiz_attempts#submit_quiz_react'
  get "quiz_results/:id" => 'quiz_attempts#get_quiz_results'
  get "view_all_attempts/:user_id" => 'quiz_attempts#view_all_attempts'
  post "create_question" => 'quizz#create_question'
  get "question/:id" => 'quizz#question_by_id'
  put "update_question/:id" => 'quizz#update'



  # Quiz Attempts
  get "/start_quiz/:quiz_id" => 'quiz_attempts#new', as: "start_quiz"
  get "/quiz_attempt/:id" => 'quiz_attempts#show', as: "quiz_attempt"
  post "/submit_quiz/:id" => 'quiz_attempts#submit', as: "submit_quiz_attempt"
  get "/show_quiz_result/:id" => 'quiz_attempts#show_quiz_result', as:"show_quiz_result"
  get "/view_all_quiz_attempts" => 'quiz_attempts#view_all_quiz_attempts',as: "view_all_quiz_attempts"







  




  



  root "pages#home"
  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
