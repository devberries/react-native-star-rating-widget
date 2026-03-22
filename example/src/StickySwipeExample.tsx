import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import ExampleContainer from './ExampleContainer';

export default function StickySwipeExample() {
  const [rating, setRating] = React.useState(3.5);

  return (
    <ExampleContainer title="Sticky Swipe + Scroll Lock">
      <Text style={styles.helperText}>
        Tap or drag the stars. The rating keeps control until finger release.
      </Text>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.spacer} />
        <StarRating rating={rating} onChange={setRating} />
        <View style={styles.spacer} />
      </ScrollView>
    </ExampleContainer>
  );
}

const styles = StyleSheet.create({
  helperText: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  scrollArea: {
    width: '100%',
    maxHeight: 180,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
  },
  scrollContent: {
    alignItems: 'center',
  },
  spacer: {
    height: 120,
    justifyContent: 'center',
  },
});
