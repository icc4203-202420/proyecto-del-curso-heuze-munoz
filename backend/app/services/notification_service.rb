require 'net/http'
require 'uri'
require 'json'

class NotificationService
  EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

  def self.send_push_notification(message)
    uri = URI.parse(EXPO_PUSH_URL)
    header = { 'Content-Type': 'application/json' }

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri, header)
    request.body = message.to_json

    response = http.request(request)
    Rails.logger.info("Expo Push Notification Response: #{response.body}")
  end
end
