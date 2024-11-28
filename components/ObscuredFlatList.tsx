import { NativeScrollEvent, NativeSyntheticEvent, type ViewProps } from 'react-native';
import { ItemView } from '@/components/ItemView';
import Animated, {
  interpolate,
  useAnimatedRef,
  useScrollViewOffset,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import React, { ReactElement, useRef, useState } from 'react';
import { ObscuredImage } from '@/components/ObscuredImage';
import { ViewInfo } from '@/app/(tabs)/custom';

export type ObscuredFlatListProps = ViewProps & {
    viewInfoData:ViewInfo[];
    scrollToTopFlag?:boolean;
    onFlatListScroll:{(event: NativeSyntheticEvent<NativeScrollEvent>): boolean};
  };

let styleList:{
  transform: {
      translateY: number;
  }[];
}[] = []

export function ObscuredFlatList({viewInfoData, onFlatListScroll, scrollToTopFlag}:ObscuredFlatListProps) {
    const scrollOffset = useSharedValue<number>(0);
    
    for (let item of viewInfoData) {
      styleList.push(useAnimatedStyle(
        ()=>{
          let style = {
              transform: [
              {
                  translateY: interpolate(
                    scrollOffset.value,
                    [item.totalHeight-item.rowHeight, item.totalHeight, item.totalHeight+item.rowHeight],
                    [0, 0, item.rowHeight/1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
              }
              ],
          };
          return style;
        }
      )
      )
    }

    const renderItem = ({ item, index }:{ item: ViewInfo, index: number }) => {
      let flex = item.imageWidth/item.imageHeight;
      let obscuredImage = <ObscuredImage tStyle={styleList[index]} src={item.src} id={item.id} flex={flex} />
      let itemView = <ItemView key={item.id} pos={item.pos} children={obscuredImage} text={item.description} rowHeight={item.rowHeight}></ItemView>;
      return itemView;
    };

    console.log('ObscuredFlatList rendered');

    
    return (
        <Animated.FlatList
          data={viewInfoData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onScroll={(event)=>{
            onFlatListScroll(event);
            scrollOffset.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10} 
        />
    )
    
}