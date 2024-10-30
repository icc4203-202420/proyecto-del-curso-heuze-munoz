class API::V1::UsersController < ApplicationController
  respond_to :json 
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]

  def index
    @users = User.includes(:reviews, :address => :country).all
    render json: @users
  end

  def show
    render json: @user
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

  # GET /api/v1/users/:id/attendances
  def attendances
    user = User.find(params[:id])
    attendances = user.attendances.includes(:event)
    render json: attendances.as_json(include: :event)
  end

  def friendships
    @friendships = @user.friendships.includes(:friend)
    @friends = @friendships.map(&:friend)
    render json: @friends, status: :ok
  end

  def create_friendship
    friend = User.find(params[:friend_id])
  
    # Verificar si se envió un event_id y obtener el bar_id desde el evento si existe
    if params[:event_id].present?
      event = Event.find_by(id: params[:event_id])
      bar_id = event&.bar_id # Si hay un evento, se asigna el bar_id; si no, será nil
    end
  
    # Crear la amistad sin un bar_id si no hay evento
    friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, bar_id: bar_id, event_id: params[:event_id])
  
    if friendship.save
      render json: { message: 'Friendship created successfully.' }, status: :ok
    else
      render json: friendship.errors, status: :unprocessable_entity
    end
  end

  def update_device_token
    if current_user.update(device_token: params[:device_token])
      render json: { success: true }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def send_notification
    recipient = User.find_by(id: params[:id])

    if recipient.nil?
      render json: { error: 'User not found' }, status: :not_found
      return
    end

    if recipient.device_token.blank?
      render json: { error: 'Recipient has no device token' }, status: :unprocessable_entity
      return
    end

    message = {
      to: recipient.device_token,
      sound: 'default',
      title: "#{current_user.handle} sent you a message",
      body: params[:message] || 'You have a new notification!',
      data: { sender_id: current_user.id }
    }

    NotificationService.send_push_notification(message)

    render json: { success: true }, status: :ok
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
            address_attributes: [:id, :line1, :line2, :city, :country_id],
            reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
        )
  end
end
