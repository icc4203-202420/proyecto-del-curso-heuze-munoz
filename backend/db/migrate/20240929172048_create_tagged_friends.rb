class CreateTaggedFriends < ActiveRecord::Migration[7.1]
  def change
    create_table :tagged_friends do |t|
      t.references :event_picture, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
