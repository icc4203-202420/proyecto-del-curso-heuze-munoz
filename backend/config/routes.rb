Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'current_user', to: 'current_user#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      post 'users/update_device_token', to: 'users#update_device_token'
      post 'users/:id/send_notification', to: 'users#send_notification'
      resources :countries, only: [:index]
      resources :breweries, only: [:show]
      resources :bars do
        resources :events, only: [:index] do
          resources :attendances, only: [:index, :create]
        end
      end
      resources :events, only: [:index, :show, :create, :update, :destroy] do 
        resources :event_pictures, only: [:show, :create, :index]
        resources :attendances, only: [:index, :create]
      end
      resources :beers do
        resources :reviews, index: [:show]
      end
      resources :users do
        member do
          get 'friendships'
          post 'friendships', action: :create_friendship
          get 'attendances'  
        end
        resources :reviews, only: [:index]
      end
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
  mount ActionCable.server => '/cable'
end