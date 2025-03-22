import {styles} from './styles';
import React, {useEffect, useState} from 'react';
import {Colors, globalStyles, PromotionServicesName} from '../../constants';
import {View, Text, Image} from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import axiosInstance from '../../networking/axiosInstance';

export function SwitchTogglesCustom({
  trueFalse,
  text,
  title,
  topViewStyle,
  img,
  item,
  proFunc,
  navigateToPromotion
}) {
  const [status, setStatus] = useState(trueFalse);
  const [state, setState] = useState(false);

  const checkActiveFunc = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/check-sub?store_id=${item.store_id._id}`,
      );
      setState(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkActiveFunc()
  }, [])

  const axiosFunc = async () => {
    if (status) {
      try {
        const response = await axiosInstance.put(
          `/goods/unpromote?good_id=${item._id}`,
        );
        setStatus(!status);
        proFunc(-1);
        console.log(response, 'ffff');
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const response = await axiosInstance.put(
          `/goods/promote?good_id=${item._id}`,
        );
        setStatus(!status);
        proFunc(1);
        console.log(response, 'ffff');
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View style={[styles.switchInfoView, topViewStyle]}>
      <View style={styles.imgContainer}>
        {img && <Image source={img} style={styles.img} />}
        <Text
          style={[
            styles.filterTextStyle,
            globalStyles.titleText,
            globalStyles.weightLight,
            globalStyles.titleTextSmall4,
            styles.switchText,
          ]}>
          {title}
        </Text>
      </View>
      <SwitchToggle
        switchOn={status}
        onPress={() => {
          if(!state){
            navigateToPromotion(state)
          }else{
            !proFunc && setStatus(!status);
            proFunc && axiosFunc();
          }
        }}
        circleColorOff={status ? Colors.tifany : '#FFF'}
        circleColorOn="#FFF"
        backgroundColorOn={Colors.tifany}
        backgroundColorOff="#D9D9D9"
        containerStyle={status ? styles.chekedIc : styles.customSwitch}
        circleStyle={styles.customDot}
      />
    </View>
  );
}
