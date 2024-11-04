// app/components/VideoPlayer.js

import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        rate={1.0}
        volume={1.0}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;
