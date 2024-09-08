class API::V1::BreweriesController < ApplicationController
  respond_to :json
  include Authenticable

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
  