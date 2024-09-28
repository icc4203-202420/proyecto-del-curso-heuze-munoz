class API::V1::EventPicturesController < ApplicationController
  include Authenticable

  before_action :verify_jwt_token
  before_action :set_event

  def index
    @event_pictures = @event.event_pictures
    render json: @event_pictures.map { |pic|
      pic.as_json.merge(image_url: pic.full_image_url(request.base_url))
    }
  end

  def create
    @event_picture = @event.event_pictures.new(event_picture_params)
    @event_picture.user = current_user

    if @event_picture.save
      render json: @event_picture, status: :created
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
end
  