class TaggedFriend < ApplicationRecord
  belongs_to :event_picture
  belongs_to :user

  validates :user_id, uniqueness: { scope: :event_picture_id}
end
