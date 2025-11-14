import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Dimensions } from 'react-native';
import Screen from '../../components/Screen';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Discover Our Products',
    description: 'Browse thousands of products, from fashion to tech. Find what you love, effortlessly.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200',
    buttonText: 'Next',
  },
  {
    id: 2,
    title: 'Hassle-Free Checkout',
    description: 'Seamless payments and speedy delivery. Start shopping smarter today.',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200',
    buttonText: 'Next',
  },
  {
    id: 3,
    title: 'Easy and Happy Shopping',
    description: 'Start shopping now and enjoy a world of convenience!',
    image: 'https://images.unsplash.com/photo-1548119328-5c8ae1f3f7be?w=1200',
    buttonText: 'Get Started',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlide(currentIndex);
  };

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      navigation.replace('Login');
    } else {
      // Scroll to next slide
      scrollRef.current?.scrollTo({
        x: (currentSlide + 1) * width,
        animated: true,
      });
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width, paddingHorizontal: 16, flex: 1, justifyContent: 'flex-end' }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              {/* Illustration placeholder */}
              <Image
                source={{ uri: slide.image }}
                style={{ width: '100%', height: 280, borderRadius: 20 }}
              />
            </View>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 24,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>
                {slide.title}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 8, fontSize: 14, lineHeight: 20 }}>
                {slide.description}
              </Text>
              <ActionButton
                title={slide.buttonText}
                onPress={handleNext}
                style={{ marginTop: 16 }}
              />
              <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 12, fontSize: 12 }}>
                Already have an account?{' '}
                <Text style={{ color: colors.primary, fontWeight: '600' }} onPress={() => navigation.replace('Login')}>
                  Log in
                </Text>
              </Text>
            </View>

            {/* Pagination dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 4 }}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: currentSlide === index ? 24 : 8,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: currentSlide === index ? colors.primary : colors.border,
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
