import { PagingListView } from "@/components/PagingItemView";
import { UNSPLASH_ACCESS_KEY } from "@/global/global";
import { ReactElement, useEffect, useState } from "react";
import { ImageInfo } from "./index";
import { Dimensions, View } from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

export type PagingViewInfo = {
  pos:number,
  imageInfo:ImageInfo
}

const arrCustom2:PagingViewInfo[] = [];

export default function custom2Screen() {

  const defaultInfo = {
    pos:-1,
    imageInfo:{
      id:'',
      width:0,
      height:0,
      color:'#FFFFFF',
      description:'',
      user:'',
      name:'',
      url:'./assets/react-logo.png',
      profile:''
    }
  };

  const [childView, setChildView] = useState<ReactElement>();
  const [page, setPage] = useState<number>(1);
  const { width, height } = Dimensions.get('window');

  const getNext = () => {
    setPage(page+1);
  };

  const size = 16;

  if (arrCustom2.length == 0) {
    for (let i = 0; i < Math.round(size/2); i++) {
      arrCustom2.push(defaultInfo);
    };
  };

  useEffect(()=>{
    fetch('https://api.unsplash.com/photos?per_page=20&page='+page.toString(), {
      method: 'GET',
      headers: {
        'Authorization': 'Client-ID '+UNSPLASH_ACCESS_KEY,
      },
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      
      for (let i = 0; i < json.length; i++) {
        const item = json[i];
        
        arrCustom2.push({
          pos:i,
          imageInfo:{
            id:item.id,
            width:item.width,
            height:item.height,
            color:item.color,
            description:item.alt_description,
            user:item.user.username,
            name:item.user.name,
            url:item.urls.regular,
            profile:item.user.profile_image.large,
          }
        });
      }

      setChildView(<PagingListView data={arrCustom2} onLastItem={getNext} height={height-TAB_BAR_HEIGHT} size={size} />);
    })
    .catch(err => {
      console.log('에러', err);
    });
  }, [page]);
  
  return (
    <View pointerEvents='box-none' style={{}}>{childView}</View>
  );

}