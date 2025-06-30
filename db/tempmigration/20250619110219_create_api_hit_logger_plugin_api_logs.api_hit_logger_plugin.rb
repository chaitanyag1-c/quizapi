# This migration comes from api_hit_logger_plugin (originally 20250619110022)
class CreateApiHitLoggerPluginApiLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :api_hit_logger_plugin_api_logs do |t|
      t.string :method
      t.string :path
      t.string :ip_address
      t.text :params
      t.integer :status
      t.datetime :start_time
      t.datetime :end_time
      t.string :duration
      t.text :error

      t.timestamps
    end
  end
end
