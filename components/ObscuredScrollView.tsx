import { NativeScrollEvent, NativeSyntheticEvent, type ViewProps } from 'react-native';
import { ItemView } from '@/components/ItemView';
import Animated, {
  interpolate,
  useAnimatedRef,
  useScrollViewOffset,
  useAnimatedStyle,
} from 'react-native-reanimated';
import React, { ReactElement } from 'react';
import { ObscuredImage } from '@/components/ObscuredImage';
import { ObsViewInfo } from '@/app/(tabs)/custom';

export type ObscuredScrollViewProps = ViewProps & {
    viewInfoData:ObsViewInfo[];
    scrollToTopFlag:boolean;
    onScroll:{(event: NativeSyntheticEvent<NativeScrollEvent>): boolean};
  };

export function ObscuredScrollView({viewInfoData, onScroll, scrollToTopFlag}:ObscuredScrollViewProps) {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const listData:ReactElement[] = [];

    if (scrollToTopFlag) {
      if (scrollRef.current != null) {
        scrollRef.current.scrollTo({ y:0, animated:true });
      }
    }

    var i = 0;
    for (let info of viewInfoData) {
        const tStyle = useAnimatedStyle(
          ()=>{
            let style = {
                transform: [
                {
                    translateY: interpolate(
                      scrollOffset.value,
                      [info.totalHeight-info.rowHeight, info.totalHeight, info.totalHeight+info.rowHeight],
                      [0, 0, info.rowHeight/1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    ),
                }
                ],
            };
            return style;
          }
        );
        let flex = info.imageInfo.width/info.imageInfo.height;
        let obscuredImage = <ObscuredImage tStyle={tStyle} src={info.imageInfo.url} id={info.imageInfo.id} flex={flex} />
        let itemView = <ItemView key={info.imageInfo.id} pos={i} children={obscuredImage} text={info.imageInfo.description} rowHeight={info.rowHeight}></ItemView>;
        listData.push(itemView);
        i++;
    }

    
    return (
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}
          onScroll = {onScroll}>
          {listData}
        </Animated.ScrollView>
    )
    
}