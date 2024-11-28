import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Dimensions, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UNSPLASH_ACCESS_KEY } from '@/global/global';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { ObscuredScrollView } from '@/components/ObscuredScrollView';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

export type ObsViewInfo = {
  rowHeight:number,
  totalHeight:number,
  pos:number,
  imageInfo:ImageInfo
};

export type ImageInfo = {
  id:string,
  width:number,
  height:number,
  color:string,
  description:string,
  user:string,
  name:string,
  url:string,
  profile:string,
};

let isLoading = false;
//let arr:ViewInfo[] = [];
//let totalHeight = 0;

export default function CustomScreen() {
  console.log('custom.tsx', 'launched');
  const [childView, setChildView] = useState<ReactElement>();
  const [count, setCount] = useState(1);
  const scale = useSharedValue(0);

  const { width } = Dimensions.get('window');

  const animatedStyleStart = useAnimatedStyle(() => {
    if (count == 1) {
      return {
        transform: [{ scale: 0 }], 
      };
    } else {
      return {
        transform: [{ scale: scale.value }], 
      };
    }
    
  });

  const animatedStyleEnd = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }], 
    };
  });
  
  const handlePress = (event: GestureResponderEvent, page: number) => {
    if (page > 0) {
      setCount(page);
    }
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentHeight - contentOffsetY <= layoutHeight && !isLoading) {
      scale.value = withTiming(1, { duration: 250, easing: Easing.elastic(1.2) });
      console.log('You have reached the bottom!');
      return true;
    } else {
      if (scale.value > 0) {
        scale.value = withTiming(0, { duration: 150, easing: Easing.ease });
      }
      return false;
    }
  };

  /*const handleScroll2 = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentHeight - contentOffsetY <= layoutHeight && !isLoading) {
      //scale.value = withTiming(1, { duration: 250, easing: Easing.elastic(1.2) });
      setCount(count+1);
      console.log('You have reached the bottom!');
      return true;
    } else {
      if (scale.value > 0) {
        //scale.value = withTiming(0, { duration: 150, easing: Easing.ease });
      }
      return false;
    }
  };*/

  useEffect(() => {
    console.log('useEffect');
    isLoading = true;
    fetch('https://api.unsplash.com/photos?per_page=10&page='+count.toString(), {
      method: 'GET',
      headers: {
        'Authorization': 'Client-ID '+UNSPLASH_ACCESS_KEY,
      },
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      let arr:ObsViewInfo[] = [];
      let totalHeight = 0;
      for (let i = 0; i < json.length; i++) {
        let item = json[i];
        let rowHeight = (width/2)*(item.height/item.width);
        console.log(item.user.profile_image);
        arr.push({rowHeight:rowHeight, totalHeight:totalHeight, pos:i, imageInfo:{
          id:item.id,
          width:item.width,
          height:item.height,
          color:item.color,
          description:item.alt_description,
          user:item.user.username,
          name:item.user.name,
          url:item.urls.small,
          profile:item.user.profile_image.large
        }});
        totalHeight += rowHeight;
      }
      setChildView(<ObscuredScrollView viewInfoData={arr} onScroll={handleScroll} scrollToTopFlag={true}/>);
      //setChildView(<ObscuredFlatList viewInfoData={arr} onFlatListScroll={handleScroll2}/>)
      isLoading = false;
    })
    .catch(err => {
      //console.log('에러', err);
    })
  }, [count]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1, flexDirection:'column'}}>
        {childView}
        <Animated.View style={[animatedStyleStart, styles.overlayStart]}>
          <TouchableOpacity onPress={(event)=>{ handlePress(event, count-1); }} >
            <Ionicons name="caret-back-outline" color={'white'} size={35}/>
          </TouchableOpacity >
        </Animated.View>
        <Animated.View style={[animatedStyleEnd, styles.overlayEnd]}>
          <TouchableOpacity onPress={(event)=>{ handlePress(event, count+1); }} >
            <Ionicons name="caret-forward-outline" color={'white'} size={35} />
          </TouchableOpacity >
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    gap: 0,
  },
  overlayStart: {
    position: 'absolute',
    bottom: '0%',
    left: '0%',
    width: 59,
    height: 59,
    borderRadius: 15,
    marginStart:'2.5%',
    marginBottom:'1%',
    backgroundColor: 'rgba(100, 230, 255, 0.5)',
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  overlayEnd: {
    position: 'absolute',
    bottom: '0%', 
    right: '0%',
    width: 59,
    height: 59,
    borderRadius: 15,
    marginEnd:'2.5%',
    marginBottom:'1%',
    backgroundColor: 'rgba(255, 100, 230, 0.5)',
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
});
