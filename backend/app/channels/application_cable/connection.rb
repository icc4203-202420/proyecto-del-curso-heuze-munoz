module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.add_tags 'ActionCable', "User #{current_user.id}"
    end

    private

    def find_verified_user
      token = request.params[:token]
      decoded_token = decode_token(token)
      user_id = decoded_token["sub"]
      User.find_by(id: user_id) || reject_unauthorized_connection
    rescue JWT::DecodeError => e
      logger.error "JWT Decode Error: #{e.message}"
      reject_unauthorized_connection
    end

    def decode_token(token)
      JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key, true, algorithm: 'HS256').first
    end
  end
end
