class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :set_beer

  def index
    reviews = @beer.reviews.includes(:user)
    render json: reviews.as_json(include: { user: { only: [:id, :handle] } })
  end
  
  def show
    if @review
      render json: @review.as_json(
        include: {
          user: { only: [:id, :handle] }
        }
      )
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @beer.reviews.new(review_params)
    @review.user = current_user
  
    if @review.save
      render json: @review.as_json(
        include: {
          user: { only: [:id, :handle] }
        }
      ), status: :created
      
      # Broadcast the review to friends
      broadcast_review(@review)
    else
      Rails.logger.error("Failed to save review: #{@review.errors.full_messages.join(', ')}")
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_beer
    @beer = Beer.find(params[:beer_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Beer not found' }, status: :not_found
  end

  def review_params
    params.require(:review).permit(:text, :rating)
  end

  def broadcast_review(review)
    # Assuming `current_user.friends` returns an array of User objects who are friends
    current_user.friends.each do |friend|
      ActionCable.server.broadcast(
        "feed_#{friend.id}",
        {
          type: 'review',
          review: {
            id: review.id,
            rating: review.rating,
            text: review.text,
            created_at: review.created_at,
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
      )
    end
  end
end
