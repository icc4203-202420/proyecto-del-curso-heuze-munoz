class API::V1::UsersController < ApplicationController
  respond_to :json 
  before_action :authenticate_user!, except: [:index] ###### TODO: SACR EL EXCEPT CUANDO SE IMPLEMENTE LA AUTENTICACION  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]

  def index
    #@users = User.includes(:reviews, :address).all
    @users = User.all
    render json: {users: @users},status: :ok
  end

  def show
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def friendships
    @friendships = @user.friendships.includes(:friend)
    @friends = @friendships.map(&:friend)
    render json: @friends, status: :ok
  end

  def create_friendship
    @user = User.find(params[:id])
    friend = User.find(params[:friend_id])
    
    # Puedes ajustar este valor según tu lógica de negocio
    bar_id = params[:bar_id] || default_bar_id # Proporciona un valor adecuado para bar_id
  
    friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, bar_id: bar_id)
  
    if friendship.save
      render json: { message: 'Friendship created successfully.' }, status: :ok
    else
      render json: friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    if params[:user_id].present?
      @user = User.find(params[:user_id])
    else
      render json: { error: 'User ID is missing' }, status: :bad_request
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end
