class API::V1::RegistrationsController < Devise::RegistrationsController
  include ::RackSessionsFix
  respond_to :json

  private

  # Permitimos los parámetros para el registro de un usuario y su dirección
  def sign_up_params
    params.require(:user).permit(
      :email, :first_name, :last_name, :handle,
      :password, :password_confirmation,
      address_attributes: [:line1, :line2, :city, :country_id] # Añadir parámetros de dirección anidados
    )
  end

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }
    else
      render json: {
        status: { message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
