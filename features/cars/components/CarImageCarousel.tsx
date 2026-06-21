import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Text, XStack } from 'tamagui';

const { width } = Dimensions.get('window');

interface Props {
  images: string[];
  make: string;
  model: string;
}

export function CarImageCarousel({ images, make, model }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const items = images.length > 0 ? images : ['https://placehold.co/800x500/EEF2FF/6366F1?text=No+Image'];

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            accessibilityLabel={`${make} ${model} photo`}
          />
        )}
      />
      {items.length > 1 && (
        <XStack
          position="absolute"
          b={12}
          self="center"
          gap="$1"
        >
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === activeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)' },
              ]}
            />
          ))}
        </XStack>
      )}
      <XStack
        position="absolute"
        b={12}
        r={12}
        bg="rgba(0,0,0,0.45)"
        rounded={10}
        px="$2"
        py={4}
      >
        <Text color="white" fontSize={12} fontWeight="600">
          {activeIndex + 1} / {items.length}
        </Text>
      </XStack>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width, height: 280 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
