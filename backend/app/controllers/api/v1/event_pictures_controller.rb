class API::V1::EventPicturesController < ApplicationController
  include Authenticable

  before_action :verify_jwt_token
  before_action :set_event

  def index
    @event_pictures = @event.event_pictures

    render json: @event_pictures.map { |pic|
      pic.as_json.merge(
        image_url: url_for(pic.image), 
        tagged_friends: pic.tagged_friends.map { |friend| { id: friend.user_id, handle: friend.user.handle } } # Cambié friend_id a user_id
      )
    }
  end

  def create
    @event_picture = @event.event_pictures.new(event_picture_params)
    @event_picture.user = current_user

    if @event_picture.save
      # Guarda los amigos etiquetados
      tagged_friends_params.each do |friend_id|
        TaggedFriend.create(event_picture_id: @event_picture.id, user_id: friend_id) # Cambié friend_id a user_id
      end

      # Renderiza la respuesta incluyendo los amigos etiquetados
      render json: @event_picture.as_json.merge(
        image_url: url_for(@event_picture.image),
        tagged_friends: @event_picture.tagged_friends.map { |friend| { id: friend.user_id, handle: friend.user.handle } } # Cambié friend_id a user_id
      ), status: :created
    else
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def event_picture_params
    params.require(:event_picture).permit(:description, :image)
  end

  # Método para obtener los amigos etiquetados del parámetro
  def tagged_friends_params
    params[:tagged_friends] || [] # Asegúrate de enviar esto desde el frontend
  end
end
