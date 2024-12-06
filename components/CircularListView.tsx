import { CircularViewInfo } from "@/app/(tabs)/custom3";
import { Ionicons } from "@expo/vector-icons";
import { ReactElement, useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, ViewProps } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

type CircularListViewProps = ViewProps & {
    data:CircularViewInfo[];
    numItems:number;
    getPage:(num:number)=>void;
    page:number;
};

export function CircularListView({data, numItems, getPage, page}:CircularListViewProps) {

    const cardHeight = 375;
    const cardWidth = 250;
    const d = 250;

    const moveX = useSharedValue<number>(0);
    const rotation = useSharedValue<number>(0);
    //const [current, setCurrent] = useState<number>(0);
    //const currentRef = useRef(0);
    //const movedRef = useRef(0);
    const { width, height } = Dimensions.get('window');
    const listData:ReactElement[] = [];
    const textList:ReactElement[] = [];
    const itemRots:number[] = [];

    const startX = width/2-cardWidth/2;
    const startY = -d/1.1;
    
    const speed = width*200;

    const mergeCards = (num:number) => {
        moveX.value = withTiming(0, {duration:500, easing:Easing.linear});
        rotation.value = withTiming(1, {
            duration: 500,
            easing: Easing.circle,
          }, ()=>{runOnJS(getPage)(num);});
    };

    const spreadCards = () => {
        rotation.value = withTiming(0, {
            duration: 500,
            easing: Easing.exp,
          });
    };

    useEffect(()=>{
        if (page > 0) {
            spreadCards();
        };
    }, [page]);

    for (let i = 0; i < numItems; i++) {

        itemRots.push((360/numItems)*i);

        const item = data[i];

        const animatedImageStyle = useAnimatedStyle(()=>{
            const zeroRo = (360/numItems)*i;
            let rotate = interpolate(
                moveX.value,
                [-speed, 0, speed],
                [zeroRo-360, zeroRo, zeroRo+360]
            );

            rotate = rotate-rotation.value*zeroRo;

            const x = startX+d*Math.sin((rotate)*(Math.PI/180));
            const y = startY+d*Math.cos((rotate)*(Math.PI/180));

            const scale = interpolate(x, [0, startX, startX*2], [1/2.5, 1, 1/2.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            let z = interpolate(x, [0, startX, startX*2], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            z = Math.round(z);

            return(
                {
                    transform:[
                        {
                            rotate:rotate.toString()+'deg',
                        },
                        {
                            scale:scale
                        }
                    ],
                    bottom:y,
                    start:x,
                    zIndex:z
                }
            );
        });

        const animatedTextStyle = useAnimatedStyle(()=>{

            const x = moveX.value%speed;

            const factor = speed/numItems;
            let pos = 0+width*i;

            const next = -i+1;
            const previous = -i-1;

            if ((x>factor*previous&&x<factor*next)) {
                pos = interpolate(
                    x,
                    [factor*previous, factor*(-i), factor*next],
                    [-width, 0, width]
                );
            } else if (x>factor*(numItems+previous)&&x<factor*(numItems+next)) {
                pos = interpolate(
                    x,
                    [factor*(numItems+previous), factor*(numItems+next)],
                    [-width, width]
                );
            } else if (i==0&&x>(factor*previous+speed)&&x<speed) {
                pos = interpolate(
                    x,
                    [(factor*previous+speed), speed],
                    [-width, 0]
                );
            } else if (i==0&&x>-speed&&x<(factor*next-speed)) {
                pos = interpolate(
                    x,
                    [-speed, (factor*next-speed)],
                    [0, width]
                );
            } else {
                pos = width;
            }
            
            return(
                {
                    start:pos
                }
            );
        });

        let textBox = <Animated.View key={item.imageInfo.id+'_text'} style={[animatedTextStyle, styles.parent, {bottom:(cardHeight+d/5)}]}>
            <Image style={[styles.profileImage, {borderColor:item.imageInfo.color}]} source={{uri:item.imageInfo.profile}}/>
            <Text style={styles.profileText}>{item.imageInfo.name}</Text>
            <Text style={styles.text}>{item.imageInfo.description}</Text>
            </Animated.View>;

        textList.push(textBox);
        listData.push(
            <Animated.Image key={item.imageInfo.id} style={[animatedImageStyle, styles.image, {position:'absolute'}, {width:cardWidth, height:cardHeight}]} source={{uri:item.imageInfo.url}}/>
        );

    };

    /*const gestureEnd = (val:number) => {
        console.log('end', val);
        let dif = val - currentRef.current;
        let factor = speed/numItems;
        let movedPos = dif/factor*(-1);
        currentRef.current = val;
        console.log('moved :', movedPos);
        movedRef.current = movedPos;
    };*/

    const pan = Gesture.Pan()
        .onBegin(()=>{
        })
        .onChange((event) => {
            moveX.value += event.velocityX;
        })
        .onFinalize((event)=>{
            const dividend = moveX.value;
            const divisor = speed/numItems;
            const halfDivisor = divisor/2;
            const r = dividend%divisor;
            let toValue = moveX.value;
            if (Math.abs(r) >= halfDivisor) {
                toValue = moveX.value+((moveX.value/Math.abs(moveX.value))*(divisor)-r);
                
            } else {
                toValue = moveX.value-r;
            };
            moveX.value = withSpring(toValue, { damping: 7.5, stiffness: 100, mass: 1 });
            //runOnJS(gestureEnd)(toValue);
        });

    return(
        <GestureHandlerRootView style={{width:'100%', height:'100%', position:'relative'}}>
        <TouchableOpacity style={[styles.button, {position:'absolute', end:0, top:0, zIndex:2}]} onPress={()=>{mergeCards(+1);}}>
            <Text style={[styles.buttonText, {textAlign:'right'}]}>NEXT</Text>
            <Ionicons name='arrow-forward-outline' size={20} color={'#000'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {position:'absolute', start:0, top:0, zIndex:2, display:(page-1)?'flex':'none'}]} onPress={()=>{mergeCards(-1);}}>
            <Ionicons name='arrow-back-outline' size={20} color={'#000'} />
            <Text style={[styles.buttonText, {textAlign:'left'}]}>PREVIOUS</Text>
        </TouchableOpacity>
            <GestureDetector gesture={pan} >
                <View style={{height:'100%', width:'100%', position:'relative', alignItems:'center', justifyContent:'center'}} >
                {textList}
                {listData}
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    text:{
        width:'80%',
        fontSize:12,
        textAlign: 'center'
    },
    parent:{
        flexDirection:'column',
        width:'100%',
        position:'absolute',
        paddingStart:'5%',
        paddingEnd:'5%',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    image:{
        resizeMode:'cover',
        borderRadius:3,
    },
    profileImage:{
        width:50,
        height:50,
        borderRadius:500,
        borderWidth:1.5,
        marginBottom:5
    },
    profileText:{
        fontWeight:'bold',
        textAlign: 'center',
        fontSize:14,
        marginStart:5
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop:25,
    },
    buttonText:{
        fontWeight:'bold',
        fontSize:14,
    },
})