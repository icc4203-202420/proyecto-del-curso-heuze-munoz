class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :verify_jwt_token

  def index
    if params[:bar_id]
      @events = Bar.find(params[:bar_id]).events
    else
      @events = Event.all
    end
    render json: { events: @events }, status: :ok
  end

  def show
    if @event.flyer.attached?
      render json: @event.as_json.merge({ 
        flyer_url: url_for(@event.flyer), 
        thumbnail_url: url_for(@event.thumbnail) }),
        status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end
  end

  def create
    @event = Event.new(event_params.except(:flyer_base64))
    handle_image_attachment if event_params[:flyer_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    handle_image_attachment if event_params[:flyer_base64]

    if @event.update(event_params.except(:flyer_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end  

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def event_params
    params.require(:event).permit(
      :name, :description, :date, :bar_id, :flyer_base64,
      :start_date, :end_date
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:flyer_base64])
    @event.flyer.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end
