import React, {useState} from 'react';
import {styles} from './styles';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import winIcon from '../../../assets/images/winIcon.png';
import {SwitchTogglesCustom} from '../../switchTogglesCustom';
import {BaseUrl, globalStyles, GoodsDataName, imageUrl, PromotionServicesName} from '../../../constants';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

export function FormGoods({item, index, navigation, proFunc, navigateToPromotion}) {
  const img = Array.isArray(item.photo_list[0])
    ? item.photo_list[0][0]
    : item.photo_list[0];
  const [loading, setLoading] = useState(false);



  return (
    <TouchableOpacity
      style={styles.containerForm}
      onPress={() => {
        let a = item.photo_list.map(item => {
          return {
            uri: imageUrl + item,
          };
        });
        navigation.navigate(GoodsDataName, {
          item: {
            ...item,
            photo_list: a,
            old: item.photo_list,
          },
        });
      }}>
      <View style={styles.imgFormCont}>
        {loading ? (
          <ActivityIndicator
            size={40}
            color={'#569690'}
            style={{
              position: 'absolute',
              zIndex: 10,
              bottom: 0,
              top: 0,
              left: 0,
              right: 0,
            }}
          />
        ) : null}
        <Image
          onLoadStart={e => {
            setLoading(true);
          }}
          onLoad={e => {
            setLoading(false);
          }}
          onLoadEnd={e => setLoading(false)}
          source={{uri: imageUrl + '/' + img}}
          style={styles.imgForm}
        />
      </View>
      <View style={styles.formContent}>
        <View style={styles.goodsText}>
          <Text
            style={[
              globalStyles.titleText,
              globalStyles.weightLight,
              globalStyles.titleTextSmall,
              globalStyles.textAlignLeft,
            ]}>
            {item?.title}
          </Text>
        </View>
        <View style={styles.toggleContainer}>
          <SwitchTogglesCustom
            item={item}
            trueFalse={item.is_promoted}
            title={'Продвигать'}
            proFunc={proFunc}
            img={winIcon}
            topViewStyle={styles.toggleSwitch}
            navigateToPromotion={navigateToPromotion}
          />
        </View>
        <View style={styles.formFooterContainer}>
          <Text
            numberOfLines={1}
            style={[
              globalStyles.titleText,
              globalStyles.weightBold,
              globalStyles.titleTextSmall,
              styles.prc,
            ]}>
            {item.price} р
          </Text>
          {item.time_to_get_ready === "Всегда в наличии" && (
            <Text
              numberOfLines={1}
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                globalStyles.titleTextSmall,
                styles.prc,
              ]}>
              {item.count} шт
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
