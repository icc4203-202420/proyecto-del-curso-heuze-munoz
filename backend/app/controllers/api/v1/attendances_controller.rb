class API::V1::AttendancesController < ApplicationController
  include Authenticable

  before_action :set_event, only: [:create]
  before_action :verify_jwt_token, only: [:create]

  def create
    user_id = params[:user_id]
    @attendance = @event.attendances.find_or_create_by(user_id: user_id)

    if @attendance.persisted?
      render json: { attendance: @attendance, message: 'Check-in successful.' }, status: :ok
    else
      render json: @attendance.errors, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find_by(id: params[:event_id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end
end
