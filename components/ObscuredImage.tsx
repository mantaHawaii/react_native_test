import { View, type ViewProps, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export type ObscuredImageProps = ViewProps & {
    imagePosition?: number;
    tStyle: {
      transform: {
          translateY: number;
      }[];
    };
    src?:string;
    flex?:number;
};

export function ObscuredImage({imagePosition, tStyle, src, flex}: ObscuredImageProps) {
    imagePosition = imagePosition ?? 0;
    flex = flex ?? 1;
    return (
        <Animated.View style={[{flex:flex}, styles.container]}>
        <Animated.Image
          style={[styles.image, tStyle]}
          source={{uri:src}} />
        <View
          style={styles.overlay}
        />
        <View
          style={[styles.overlay, {bottom: 0}]}
        />
      </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor:'white'
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode:'cover',
    },
    overlay: {
      position: 'absolute',
      width:'100%',
      height: '10%',
      backgroundColor: 'rgba(255, 255, 255, 255)'
    }
  });