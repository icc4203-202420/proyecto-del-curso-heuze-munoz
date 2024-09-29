class TaggedFriend < ApplicationRecord
  belongs_to :event_picture
  belongs_to :user
end
