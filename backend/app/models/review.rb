class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  after_save :update_beer_rating
  after_destroy :update_beer_rating

  validates :rating, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 5 }
  after_create_commit :broadcast_review
  private

  def update_beer_rating
    beer.update_avg_rating
  end

  def broadcast_review
    friends = user.friends

    friends.each do |friend|
      FeedChannel.broadcast_to(friend, {
        type: 'review',
        id: id,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          handle: user.handle
        },
        beer: {
          id: beer.id,
          name: beer.name
        },
        rating: rating,
        created_at: created_at
      })
    end
  end

  def friends_of_user
    user.friends
  end

end
