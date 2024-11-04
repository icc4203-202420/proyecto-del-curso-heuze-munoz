class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances
  has_many :event_pictures ,dependent: :destroy
  has_one_attached :flyer
  after_save :enqueue_video_job, if: :end_date_passed?

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end  
  
  private

  def end_date_passed?
    end_date.present? && end_date < Time.current && !video_generated
  end

  def enqueue_video_job
    GenerateEventVideoJob.perform_later(id)
  end
end
