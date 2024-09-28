class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_one_attached :image

  validates :image, presence: true
  def full_image_url(base_url)
    "#{base_url}#{Rails.application.routes.url_helpers.url_for(image, only_path: true)}"
  end
end
