class AddEventIdToFriendships < ActiveRecord::Migration[7.1]
  def change
    # Añade la columna event_id que puede ser null
    add_column :friendships, :event_id, :integer, null: true

    # Modifica bar_id para que pueda ser null
    change_column_null :friendships, :bar_id, true

    # Agrega un índice para event_id (si es necesario)
    add_index :friendships, :event_id
  end
end
