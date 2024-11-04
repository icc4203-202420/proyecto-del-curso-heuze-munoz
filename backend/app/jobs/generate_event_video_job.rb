class GenerateEventVideoJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find(event_id)
    images_dir = Rails.root.join("public", "event_images", event_id.to_s)
    FileUtils.mkdir_p(images_dir) # Create directory if it doesn’t exist

    # Download each attached photo to the directory
    event.event_pictures.each_with_index do |event_picture, index|
      image_path = Rails.root.join("public", "event_images", "#{event.id}", "image_#{index}.jpg")
      FileUtils.mkdir_p(File.dirname(image_path))
      
      # Download and save the image to the specified path
      File.open(image_path, 'wb') do |file|
        file.write(event_picture.image.download)
      end
    end
    

    output_path = Rails.root.join("public", "event_videos", "event_#{event_id}_summary.mp4")
    system("ffmpeg -framerate 1/3 -pattern_type glob -i '#{images_dir}/*.jpg' -c:v libx264 #{output_path}")

    # Update event with video URL
    event.update(video_generated: true, video_url: "/event_videos/event_#{event_id}_summary.mp4")

    # Clean up downloaded images
    FileUtils.rm_rf(images_dir)
  end
end
