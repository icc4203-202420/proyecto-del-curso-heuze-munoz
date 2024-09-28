class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_one_attached :image

  validates :image, presence: true
end
