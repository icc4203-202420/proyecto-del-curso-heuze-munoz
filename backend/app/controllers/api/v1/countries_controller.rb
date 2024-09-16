class API::V1::CountriesController < ApplicationController
    respond_to :json

    def index
      countries = Country.all
      render json: countries
    end
  end
    
