require 'factory_bot_rails'

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Initialize the review counter
ReviewCounter.create(count: 0)

if Rails.env.development?

  # Crear países
  countries = FactoryBot.create_list(:country, 5)

  # Crear cervecerías (breweries) con marcas (brands) y cervezas (beers)
  countries.map do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Get all beers after they are created
  beers = Beer.all

  # Crear usuarios con direcciones asociadas
  users = FactoryBot.create_list(:user, 10) do |user, i|
    user.address.update(country: countries.sample)
  end

  # Crear bares con direcciones y cervezas asociadas
  bars = FactoryBot.create_list(:bar, 5) do |bar|
    bar.address.update(country: countries.sample)
    bar.beers << beers.sample(rand(1..3)) # Associate beers with bars
  end

  # Crear eventos asociados a los bares
  events = bars.map do |bar|
    FactoryBot.create(:event, bar: bar)
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  # Crear attendances (asistencia) de usuarios a eventos
  users.each do |user|
    # Users attend random events
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end

    # Users review random beers
    beers.sample(3).each do |beer|
      FactoryBot.create(:review, user: user, beer: beer, rating: rand(1.0..5.0).round(1), text: Faker::Lorem.sentence(word_count: 15))
    end
  end

  # Crear un usuario por defecto sin dirección
  default_user = FactoryBot.create(:user, first_name: 'Default', last_name: 'User', email: 'default@example.com', handle: 'defaultuser', password: 'password', password_confirmation: 'password')
  
  # Crear amigos para el usuario por defecto
  # Asegúrate de que `users` tenga al menos 2 usuarios para crear amistades.
  friends = users.reject { |user| user == default_user }.sample(2) # Elige 2 usuarios distintos
  friends.each do |friend|
    FactoryBot.create(:friendship, user: default_user, friend: friend, bar: bars.sample)
  end

end
