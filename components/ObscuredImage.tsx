import { View, type ViewProps, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export type ObscuredImageProps = ViewProps & {
    imagePosition?: number;
    tStyle?: {
      transform: {
          translateY: number;
      }[];
    };
    src?:string;
    flex?:number;
};

export function ObscuredImage({style, imagePosition, tStyle, src, flex, ...otherProps}: ObscuredImageProps) {
    imagePosition = imagePosition ?? 0;
    flex = flex ?? 1;
    tStyle = tStyle ?? {transform:[{translateY:0}]};
    return (
        <View style={[{flex:flex}, styles.container]}>
        <Animated.Image
          style={[styles.image, tStyle]}
          source={{uri:src}} />
        <View
          style={styles.overlay}
        />
        <View
          style={[styles.overlay, {bottom: 0}]}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor:'white'
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode:'center',
      objectFit: 'cover'
    },
    overlay: {
      position: 'absolute',
      width:'100%',
      height: '10%',
      backgroundColor: 'rgba(255, 255, 255, 255)'
    }
  });