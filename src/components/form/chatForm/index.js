import React from 'react';
import {styles} from './styles';
import {Text, TouchableOpacity, View} from 'react-native';
import {globalStyles, MessagesName} from '../../../constants';

export const ChatForm = ({item, navigation, index}) => {
  return (
    <TouchableOpacity
      style={styles.chatContainer}
      onPress={() =>
        navigation.navigate(MessagesName, {
          item,
          state: item.priority === 'admin' ? true : false,
        })
      }>
      <Text
        style={[
          globalStyles.titleText,
          globalStyles.titleTextSmall,
          globalStyles.textAlignLeft,
          styles.name,
        ]}>
        {item?.user_id?.full_name ?item?.user_id?.full_name : item.name }
      </Text>
      <Text
        style={[
          globalStyles.titleText,
          globalStyles.titleTextSmall,
          globalStyles.textAlignLeft,
          globalStyles.weightLight,
          {marginRight: 30},
        ]}
        numberOfLines={1}>
        {item.lastMessage.indexOf('/images') !== -1 ? 'Фото' : item.lastMessage}
      </Text>
      <View style={styles.timeContainer}>
        <Text
          style={[
            globalStyles.titleText,
            globalStyles.titleTextSmall4,
            globalStyles.weightLight,
          ]}>
          {item.time.slice(0, 5)}
        </Text>
        {item.newMessCountSeller ? (
          <View style={styles.notNumberCont}>
            <Text style={styles.notNumber}>{item.newMessCountSeller}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
