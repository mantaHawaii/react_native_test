import { PagingListView } from "@/components/PagingItemView";
import { UNSPLASH_ACCESS_KEY } from "@/global/global";
import { ReactElement, useEffect, useState } from "react";
import { ImageInfo } from "./index";
import { View } from "react-native";
import { CircularListView } from "@/components/CircularListView";

export type CircularViewInfo = {
  pos:number,
  imageInfo:ImageInfo
}

export default function custom3Screen() {

  const [childView, setChildView] = useState<ReactElement>();
  const [page, setPage] = useState<number>(1);

  const getPage = (num:number) => {
    if (page+num <= 0) {
      num = 0;
    };
    setPage(page+num);
  };

  useEffect(()=>{
    fetch('https://api.unsplash.com/photos?per_page=10&page='+page.toString(), {
      method: 'GET',
      headers: {
        'Authorization': 'Client-ID '+UNSPLASH_ACCESS_KEY,
      },
    })
    .then(response => {
      return response.json();
    })
    .then(json => {

      let arr:CircularViewInfo[] = [];
      
      for (let i = 0; i < json.length; i++) {
        let item = json[i];
        arr.push({
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
      setChildView(<CircularListView data={arr} numItems={10} getPage={getPage} page={page}/>);
    })
    .catch(err => {
      console.log('에러', err);
    });
  }, [page]);
  
  return (
    <View pointerEvents='box-none'>{childView}</View>
  );

}