class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_one_attached :image

  validates :image, presence: true

  has_many :tagged_friends
  has_many :users, through: :tagged_friends

  after_create_commit :broadcast_event_picture

  private

  def broadcast_event_picture
    friends = user.friends

    image_url = Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true) if image.attached?

    friends.each do |friend|
      FeedChannel.broadcast_to(friend, {
        type: 'event_picture',
        id: id,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          handle: user.handle
        },
        event: {
          id: event.id,
          name: event.name
        },
        description: description,
        image_url: image_url,
        tagged_friends: tagged_friends.map { |tf| { id: tf.user.id, handle: tf.user.handle } },
        created_at: created_at
      })
    end
  end

  def friends_of_user
    user.friends
  end

  
end
