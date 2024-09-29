class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_one_attached :image

  validates :image, presence: true

  has_many :tagged_friends
  has_many :users, through: :tagged_friends
end
