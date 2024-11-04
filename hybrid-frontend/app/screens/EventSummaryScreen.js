import React from 'react';
import { View, StyleSheet } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';

const EventSummaryScreen = ({ route }) => {
  const { videoUrl } = route.params;

  return (
    <View style={styles.container}>
      <VideoPlayer videoUrl={videoUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default EventSummaryScreen;
