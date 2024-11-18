class API::V1::EventPicturesController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  before_action :set_event, only: [:index, :create]
  before_action :set_event_picture, only: [:show]

  def index
    @event_pictures = @event.event_pictures.includes(:tagged_friends, image_attachment: :blob)

    render json: @event_pictures.map { |pic|
      pic.as_json.merge(
        image_url: url_for(pic.image),
        tagged_friends: pic.tagged_friends.map { |friend| { id: friend.user_id, handle: friend.user.handle } }
      )
    }
  end

  def show
    render json: @event_picture.as_json.merge(
      image_url: url_for(@event_picture.image),
      user: { id: @event_picture.user.id, handle: @event_picture.user.handle },
      tagged_friends: @event_picture.tagged_friends.map { |friend| { id: friend.user_id, handle: friend.user.handle } }
    )
  end
  

  def create
    @event_picture = @event.event_pictures.new(event_picture_params)
    @event_picture.user = current_user
  
    if @event_picture.save
      tagged_friend_ids = tagged_friends_params
      tagged_friend_ids.each do |friend_id|
        TaggedFriend.create(event_picture_id: @event_picture.id, user_id: friend_id)
      end
      send_notifications_to_tagged_friends(tagged_friend_ids, @event.id, @event_picture.id)
  
      broadcast_to_friends(@event_picture)
  
      render json: @event_picture.as_json.merge(
        image_url: url_for(@event_picture.image),
        tagged_friends: @event_picture.tagged_friends.map { |friend| { id: friend.user_id, handle: friend.user.handle } }
      ), status: :created
    else
      Rails.logger.error("Failed to save event picture: #{@event_picture.errors.full_messages.join(', ')}")
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def set_event_picture
    @event_picture = EventPicture.find(params[:id])
  end

  def event_picture_params
    params.permit(:description, :image)
  end

  def tagged_friends_params
    return [] unless params[:tagged_friends]

    begin
      JSON.parse(params[:tagged_friends]).map { |friend| friend['id'] }
    rescue JSON::ParserError
      []
    end
  end

  def send_notifications_to_tagged_friends(friend_ids, event_id, event_picture_id)
    friend_ids.each do |friend_id|
      user = User.find(friend_id)
      next unless user.device_token.present?
  
      message = {
        to: user.device_token,
        sound: 'default',
        title: "#{current_user.handle} tagged you in a photo!",
        body: "#{current_user.handle} has uploaded a new photo and tagged you.",
        data: {
          event_id: event_id,
          event_picture_id: event_picture_id,
          uploader: {
            id: current_user.id,
            handle: current_user.handle
          }
        }
      }
  
      NotificationService.send_push_notification(message)
    end
  end
  def broadcast_to_friends(event_picture)
    current_user.friends.each do |friend|
      ActionCable.server.broadcast(
        "feed_#{friend.id}", # Personalized channel for each friend
        {
          type: 'event_picture',
          event_picture: {
            id: event_picture.id,
            description: event_picture.description,
            image_url: url_for(event_picture.image),
            created_at: event_picture.created_at,
            event: {
              id: event_picture.event.id,
              name: event_picture.event.name
            }
          },
          user: {
            id: current_user.id,
            handle: current_user.handle
          }
        }
      )
    end
  end
end
