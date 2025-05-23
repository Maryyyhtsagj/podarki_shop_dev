import {styles} from './styles';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import Modal from 'react-native-modal';
import closeIcon from '../../../assets/images/closeIcon.png';
import {AppButton, AppInput} from '../../core';
import axiosInstance from '../../../networking/axiosInstance';
import {globalStyles} from '../../../constants';

export function ChangePasswordModal(props) {
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const onChangeTextFunc = (e, set) => {
    setError('');
    set(e);
  };

  const onPressFunc = async () => {
    if (
      password.length >= 8 &&
      newPassword.length >= 8 &&
      repPassword.length >= 8 &&
      newPassword === repPassword
    ) {
      await axiosFunc();
    } else if (password.length < 8) {
      setError('parol 1 ');
    } else if (repPassword.length < 8) {
      setError('new parol 1');
    } else if (newPassword.length < 8) {
      setError('new parol 2 ');
    } else if (newPassword !== repPassword) {
      setError('newPassword !== repPassword');
    }
  };

  const axiosFunc = async () => {
    props.modalFunc(false);
    props.loadingFunc(true);
    try {
      const data = {
        oldPassword: password,
        newPassword: repPassword,
        confPassword: newPassword,
      };
      const response = await axiosInstance.put(
        '/users/profile/seller/password',
        data,
      );
      props.modalFunc(false);
      props.loadingFunc(false);
      Alert.alert('', response.data.message);
    } catch (e) {
      console.log(e);
      props.loadingFunc(false);
      props.modalFunc(true);
      Alert.alert('', e.response.data.error);
    }
  };

  return (
    <Modal
      visible={props.visible}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      testID={'modal'}
      swipeDirection="down"
      backdropColor={'rgba(250, 250, 250, 0.5)'}
      backdropOpacity={1}
      style={styles.modalContainer}
      onSwipeComplete={() => {
        props.modalFunc(false);
      }}
      onBackButtonPress={() => {
        props.modalFunc(false);
      }}>
      <View style={styles.modalContent}>
        <View style={styles.back_button_View}>
          <TouchableOpacity
            onPress={() => {
              props.modalFunc(false);
            }}>
            <Image source={closeIcon} style={styles.back_button} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <AppInput
            style={styles.input}
            placeholder={'Пароль'}
            secureTextEntry
            onChangeText={e => {
              onChangeTextFunc(e, setPassword);
            }}
          />
          <AppInput
            placeholder={'Введите новый пароль'}
            style={styles.input}
            secureTextEntry
            onChangeText={e => {
              onChangeTextFunc(e, setRepPassword);
            }}
          />
          <AppInput
            style={styles.input}
            placeholder={'Повторите пароль'}
            secureTextEntry
            onChangeText={e => {
              onChangeTextFunc(e, setNewPassword);
            }}
          />
          <Text style={styles.error}>{error}</Text>
          <AppButton text={'Изменить'} onPress={onPressFunc} />
        </View>
      </View>
    </Modal>
  );
}
