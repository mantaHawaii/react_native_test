import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import Animated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// 데이터 배열
const data = Array.from({ length: 20 }).map((_, index) => ({
  key: String(index),
  label: `아이템 ${index + 1}`,
}));

const MyFlatList = () => {
  // 애니메이션 값을 위한 SharedValue (각 아이템에 대해 고유한 값)
  const animationValues = useSharedValue(new Array(data.length).fill(0));

  // 애니메이션 스타일 정의: 인덱스에 따른 애니메이션 적용
  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: withSpring(animationValues.value[index], {
              damping: 20,
              stiffness: 100,
            }),
          },
        ],
      };
    });
  };

  // 렌더링 이후 애니메이션 값 변경: 애니메이션 트리거
  useEffect(() => {
    setTimeout(() => {
      // 각 항목에 대한 애니메이션 값 변경
      animationValues.value = animationValues.value.map((_, index) => index * 10);
    }, 500); // 0.5초 후 애니메이션 시작
  }, []);

  // 아이템 렌더링
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // 각 항목에 대한 애니메이션 스타일 가져오기
    const animatedStyle = getAnimatedStyle(index);

    return (
      <Animated.View
        style={[
          { padding: 20, backgroundColor: 'skyblue', marginBottom: 10 },
          animatedStyle, // 계산된 애니메이션 스타일 적용
        ]}
      >
        <Text>{item.label}</Text>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
    />
  );
};

export default MyFlatList;
