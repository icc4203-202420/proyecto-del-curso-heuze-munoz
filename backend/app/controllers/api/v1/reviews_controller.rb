class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:create]
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :set_beer
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    reviews = @beer.reviews.includes(:user)
    render json: reviews, include: [:user]
  end

  def show
    if @review
      render json: { review: @review.as_json }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    review = @beer.reviews.new(review_params)
    review.user = User.find(params[:user_id])

    if review.save
      render json: { review: review }, status: :created
    else
      render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
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

  def set_user
    @user = User.find(params[:user_id]) 
  end

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
  
  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end 
end
