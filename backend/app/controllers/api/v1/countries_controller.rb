class API::V1::CountriesController < ApplicationController
  respond_to :json
  include Authenticable
  def index
    countries = Country.all
    render json: countries
  end
end
  