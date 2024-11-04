class AddVideoUrlToEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :events, :video_url, :string
    add_column :events, :video_generated, :boolean
    add_column :events, :default, :string
    add_column :events, :false, :string
  end
end
