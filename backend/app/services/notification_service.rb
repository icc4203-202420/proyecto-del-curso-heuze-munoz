class NotificationService
  require 'net/http'
  require 'uri'
  require 'json'

  EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send'

  def self.send_push_notification(message)
    uri = URI.parse(EXPO_PUSH_ENDPOINT)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)
    request['Content-Type'] = 'application/json'
    request.body = message.to_json

    response = http.request(request)
    Rails.logger.info("Push notification sent: #{response.body}")
  end
end
