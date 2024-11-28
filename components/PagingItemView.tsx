import { PagingViewInfo } from "@/app/(tabs)/custom2";
import { ReactElement, useEffect, useState } from "react";
import { Dimensions, StyleSheet, ViewProps, View, Image, Text, PanResponder } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, useAnimatedReaction, runOnJS, useAnimatedProps } from "react-native-reanimated";
import { addAlphaToHex, getComplementaryColor } from "@/utils/helpers";

type PagingListViewProps = ViewProps & {
    data:PagingViewInfo[];
    height:number;
    onLastItem:()=>void;
};

export function PagingListView({data, height, onLastItem}:PagingListViewProps) {
    const offset = useSharedValue<number>(0);
    const listData:ReactElement[] = [];
    const [current, setCurrent]= useState<number>(0);

    const goNext = (num:number) => {
        setCurrent(num);
    };

    useEffect(()=>{
        offset.value = 0;
        if (current == data.length-3) {
            console.log('onLastItem', current, data.length);
            onLastItem();
        }
    }, [current]);

    for (let i = 0; i < 3; i++) {

        let item = data[(2-i)+current] ?? {src:''};

        const animatedStyleOuter = useAnimatedStyle(()=>{

            let outerY = 0;

            switch (i) {
                case 0:
                    outerY = height;
                    break;
                case 1:
                    outerY = interpolate(
                        offset.value,
                        [-height/2, 0, height/2],
                        [0, height, height],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    );
                    break;
                case 2:
                    outerY = interpolate(
                        offset.value,
                        [-height/2, 0, height/2],
                        [0, 0, height],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    );
                    break;
            }
            return(
                {   
                    height: outerY
                }
            );
        });

        const animatedStyleText = useAnimatedStyle(()=>{

            let textY = 0;

            switch (i) {
                case 0:
                    textY = 0;
                    break;
                case 1:
                    textY = interpolate(
                        offset.value,
                        [-height/2, 0, height/2],
                        [height, 0, 0],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    );
                    break;
                case 2:
                    textY = 0;
                    break;
            }
            return(
                {   
                    transform:[
                        {translateY:textY}
                    ]
                }
            );
        });

        let fontColor = getComplementaryColor(item.imageInfo.color ?? "#FFFFFF");
        let isVisible = true;
        if (item.imageInfo.id == '') {
            isVisible = false;
        } else {
            isVisible = true;
        }

        if (!item.imageInfo.url) {
            item.imageInfo.profile = './assets/react-logo.png';
        }

        if (!item.imageInfo.profile) {
            item.imageInfo.profile = './assets/react-logo.png';
        }

        listData.push(<Animated.View key={i} style={[{height:'100%', width:'100%', overflow: 'hidden', position:'absolute'}, animatedStyleOuter, {display:isVisible?'flex':'none'}]}>
            <Animated.Image
                style={[styles.image, {height:height}]}
                source={{uri:item.imageInfo.url}}
            />
            <Animated.View style={[styles.textbox, {backgroundColor:addAlphaToHex(item.imageInfo.color ?? "#FFFFFF", 0.75)}, animatedStyleText]}>
                <View style={styles.profileBox}><Image style={[styles.profileImage, {borderColor:fontColor}]} source={{uri:item.imageInfo.profile}}/><Text style={[styles.profileText, {color:fontColor}]}>{item.imageInfo.name}</Text></View>
                <Text style={[styles.text, {color:fontColor}]}>{item.imageInfo.description}</Text>
            </Animated.View>
        </Animated.View>)

    }

    const pan = Gesture.Pan()
        .onBegin(()=>{
        })
        .onChange((event) => {
            offset.value += event.changeY;
            if (offset.value < -height/2) {
                offset.value = -height/2;
            }
            if (offset.value > height/2) {
                offset.value = height/2;
            }
            if (current == 0 && offset.value > 0) {
                offset.value = 0;
            }
        })
        .onFinalize((event)=>{
            if (offset.value == -height/2) {
                runOnJS(goNext)(current+1);
            }
            if (offset.value == height/2) {
                runOnJS(goNext)(current-1);
            }
        });
    
    
    return(
        <GestureHandlerRootView style={{width:'100%', height:height, position:'relative'}}>
            <GestureDetector gesture={pan} >
                <View style={{width:'100%', height:height, position:'relative'}} >
                {listData}
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    image:{
        width:'100%',
        height:'100%',
        resizeMode:'cover',
    },
    textbox:{
        position:'absolute',
        bottom:0,
        margin:10,
        padding:10,
        borderRadius:2,
    },
    profileBox:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingBottom:5
    },
    profileImage:{
        width:50,
        height:50,
        borderRadius:500,
        borderWidth:1.5
    },
    profileText:{
        fontWeight:'bold',
        fontSize:14,
        marginStart:5
    },
    text:{
        fontSize:15,
    }
})