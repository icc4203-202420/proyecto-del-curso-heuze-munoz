module API
  module V1
    class FeedsController < ApplicationController
      before_action :authenticate_user!
      def index
        friends_ids = current_user.friends.pluck(:id)

        reviews = Review.includes(:user, :beer)
                        .where(user_id: friends_ids)
                        .order(created_at: :desc)
                        .limit(50)

        # Obtener las fotos de eventos de los amigos, incluyendo asociaciones necesarias
        event_pictures = EventPicture.includes(:user, :event)
                                     .where(user_id: friends_ids)
                                     .order(created_at: :desc)
                                     .limit(50)

        combined_feed = (reviews + event_pictures).sort_by(&:created_at).reverse

        # Serializar los elementos del feed
        serialized_feed = combined_feed.map do |item|
          if item.is_a?(Review)
            serialize_review(item)
          elsif item.is_a?(EventPicture)
            serialize_event_picture(item)
          end
        end

        render json: { feed: serialized_feed }, status: :ok
      end

      private

      def serialize_review(review)
        {
          type: 'review',
          id: review.id,
          created_at: review.created_at,
          review: {
            id: review.id,
            rating: review.rating,
            text: review.text,
            beer: {
              id: review.beer.id,
              name: review.beer.name,
            },
            user: {
              id: review.user.id,
              handle: review.user.handle

            }
          }
        }
      end

      def serialize_event_picture(event_picture)
        {
          type: 'event_picture',
          id: event_picture.id,
          created_at: event_picture.created_at,
          event_picture: {
            id: event_picture.id,
            description: event_picture.description,
            image_url: url_for(event_picture.image),
            event: {
              id: event_picture.event.id,
              name: event_picture.event.name,
              bar: {
                id: event_picture.event.bar.id,
                name: event_picture.event.bar.name,
              }
            },
            user: {
              id: event_picture.user.id,
              handle: event_picture.user.handle

            }
          }
        }
      end
    end
  end
end
