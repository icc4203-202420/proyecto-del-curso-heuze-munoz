class API::V1::ReviewsController < ApplicationController
  respond_to :json
<<<<<<< Updated upstream
  before_action :set_user, only: [:index, :create]
=======
  include Authenticable
>>>>>>> Stashed changes
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    @reviews = Review.where(user: @user)
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
<<<<<<< Updated upstream
    @review = @user.reviews.build(review_params)
    if @review.save
      render json: @review, status: :created, location: api_v1_review_url(@review)
=======
    review = @beer.reviews.new(review_params)
    review.user = current_user

    if review.save
      render json: { review: review }, status: :created
>>>>>>> Stashed changes
    else
      render json: @review.errors, status: :unprocessable_entity
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

<<<<<<< Updated upstream
  def set_user
    @user = User.find(params[:user_id]) 
=======
  def set_beer
    @beer = Beer.find(params[:beer_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Beer not found' }, status: :not_found
>>>>>>> Stashed changes
  end

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
