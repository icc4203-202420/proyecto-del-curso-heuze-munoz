class FeedChannel < ApplicationCable::Channel
  def subscribed
    stream_from "feed_#{current_user.id}"
    logger.info "User #{current_user.id} subscribed to FeedChannel"
  end

  def unsubscribed
    logger.info "User #{current_user.id} unsubscribed from FeedChannel"
  end
end
