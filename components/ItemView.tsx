import { Text, View, type ViewProps } from 'react-native';

export type ItemViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    pos?: number;
    rowHeight: number;
    text?: string;
  };

  export function ItemView({ style, lightColor, darkColor, pos, text, rowHeight, ...otherProps }: ItemViewProps) {
    pos = pos ?? 0;
    let textStyle = {paddingStart:20, paddingEnd:20};
    if (pos%2 == 0) {
      return (
        <View style={[style, {height:rowHeight, flexDirection:'row', paddingStart:20, backgroundColor:'white'}]}>
          {otherProps.children}
          <View style={{flex:1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
            <Text style={textStyle} children={text} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={[style, {height:rowHeight, flexDirection:'row-reverse', paddingEnd:20, backgroundColor:'white'}]}>
          {otherProps.children}
          <View style={{flex:1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
            <Text style={textStyle} children={text} />
          </View>
        </View>
      );
    }
  }