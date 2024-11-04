class API::V1::AttendancesController < ApplicationController

  before_action :set_event, only: [:index, :create] # Añadir el before_action para index
  before_action :authenticate_user!, only: [:create]
  # Método para obtener todas las asistencias (check-ins) de un evento
  def index
    @attendances = @event.attendances.includes(:user)
    render json: { attendances: @attendances.map { |a| { user: a.user, created_at: a.created_at } } }, status: :ok
  end

  # Método para crear una asistencia (check-in)
  def create
    user_id = params[:user_id] || current_user.id # Si no pasas user_id, toma el id del usuario autenticado
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
