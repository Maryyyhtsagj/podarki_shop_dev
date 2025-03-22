import React from 'react';
import {styles} from './styles';
import {Image, Text, View} from 'react-native';
import {globalStyles, BaseUrl, imageUrl} from '../../../constants';

export const ApplicationsChangeForm = ({
  item,
  navigation,
  index,
  count,
  props,
}) => {
  return (
    <View style={styles.applicationsContainer}>
      <View style={styles.changeContent}>
        <Text
          style={[
            globalStyles.titleText,
            globalStyles.titleTextSmall,
            globalStyles.weightLight,
            globalStyles.textAlignLeft,
          ]}>
          Товар {index + 1}
        </Text>
        <View style={[globalStyles.row]}>
          <Image
            source={{uri: imageUrl + '/' + item?.photo_list[0]}}
            style={styles.imgForm}
          />
          <View style={styles.textCont}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                globalStyles.titleTextSmall,
                globalStyles.textAlignLeft,
              ]}>
              {item?.title}
            </Text>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightBold,
                globalStyles.titleTextSmall,
                globalStyles.textAlignLeft,
                styles.priceText,
              ]}>
              {item?.price.$numberDecimal} р
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.positView}>
        <Text
          style={[
            globalStyles.titleText,
            globalStyles.titleTextSmall,
            globalStyles.weightLight,
            globalStyles.textAlignLeft,
          ]}>
          x{count}
        </Text>
      </View>
    </View>
  );
};
