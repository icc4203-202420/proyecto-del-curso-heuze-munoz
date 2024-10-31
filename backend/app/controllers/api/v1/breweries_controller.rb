class API::V1::BreweriesController < ApplicationController
    include Authenticable
    respond_to :json
    #before_action :verify_jwt_token
  
    def show
      @beer = Beer.includes(brand: :brewery).find(params[:id])
      @bars = Bar.joins(:bars_beers).where(bars_beers: { beer_id: @beer.id })
    
      render json: {
        beer: @beer,
        brewery: @beer.brand.brewery,
        bars: @bars
      }
    end
  end
    
