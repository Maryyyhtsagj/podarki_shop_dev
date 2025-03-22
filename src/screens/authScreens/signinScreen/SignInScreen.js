import React, {useState} from 'react';
import {styles} from './styles';
import {useDispatch} from 'react-redux';
import {checkTokens, checkUser, setTokens} from '../../../utils';
import axiosInstance from '../../../networking/axiosInstance';
import {globalStyles, SET_CUSTOMER, SignupName} from '../../../constants';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {
  AppButton,
  AppForm,
  AppInput,
  BackButton,
  Loading,
  passwordValidate,
  validateEmail,
} from '../../../components';
import messaging from '@react-native-firebase/messaging';

import line from '../../../assets/images/line.png';
import pinkMonster from '../../../assets/images/pinkMonster.png';
import giftIconPink from '../../../assets/images/giftIconPink.png';
import AsyncStorage from '@react-native-community/async-storage';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import axios from 'axios';

export const getFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (!!fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
    console.log(fcmToken);
    return fcmToken;
  } catch (error) {
    alert(error?.message);
  }
};

async function setState() {
  try {
    await AsyncStorage.setItem('state', JSON.stringify(true));
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export const SignIn = ({navigation}) => {
  let dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeTextFunc = (e, set) => {
    setError('');
    set(e);
  };
  const navigationFunc = async () => {
    if (validateEmail(email) && password.length >= 8) {
      await checkedData();
    } else if (!validateEmail(email)) {
      setError('Укажите Email');
    } else if (password.length < 8) {
      setError('Укажите Пароль');
    }
  };
  const checkedData = async () => {
    setLoading(true);
    try {
      const data = { email, password };
      console.log("Data sent to login:", data);
      const response = await axiosInstance.post('/users/login/seller', data);

      await setTokens(response?.data.token);
      console.log("Logged in Token:", response?.data.token);

      await setState();
      dispatch({
        type: SET_CUSTOMER,
        payload: response.data.user_data,
      });

      let token = await checkTokens();
      console.log("Retrieved Token after login:", token);

      await postFcmToken(token);
      await axiosFunc(response.data);
    } catch (e) {
      setLoading(false);
      console.error("Login error:", e);
      console.error("Error response data:", e.response?.data);
      setError(e.response?.data?.error);
    }
  };

  const postFcmToken = async token => {
    let checkToken = await getFcmToken();
    console.log(' await Fcm Token:', checkToken);

    try {
      const res = await axios.post(
          'http://79.174.80.241:3001/api/users/fcm',
          {
            is_seller: 'true',
            token: checkToken,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
      );
      console.log('res of users/fcm', res.data);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        console.log('Error message:', e.response.data.message);
      } else {
        console.log('Error:', e);
      }
    }
  };

  const axiosFunc = async response => {
    try {
      if (Object.keys(response?.storesList).length) {
        navigation.replace('TabNavigation');
      } else {
        checkUser(response?.user_data, navigation);
      }
      setLoading(false);
    } catch (e) {
      console.log(e, 'fd');
      setLoading(false);
    }
  };

  return (
      <ScrollView
          style={[
            globalStyles.scrollContainer,
            Platform.OS === 'ios' && {marginTop: -(getStatusBarHeight(true) + 8)},
          ]}
          bounces={false}>
        <View style={[styles.container, globalStyles.container]}>
          <View style={styles.headerContainer}>
            <View style={styles.backContainer}>
              <BackButton navigation={navigation} />
            </View>
            <Image source={pinkMonster} style={styles.pinkMonster} />
            <Image source={line} style={styles.lineImg} />
          </View>
          <View style={styles.formContainer}>
            <AppForm>
              <View style={styles.formHeader}>
                <Image source={giftIconPink} style={styles.giftIconPink} />
                <Text style={[styles.titleForm, globalStyles.titleText]}>
                  Войти в учетную запись
                </Text>
              </View>
              <View>
                <View style={styles.inputContainer}>
                  <AppInput
                      placeholder={'Email'}
                      onChangeText={e => {
                        onChangeTextFunc(e, setEmail);
                      }}
                      style={styles.input}
                  />
                  <AppInput
                      style={styles.input}
                      secureTextEntry
                      onChangeText={e => {
                        onChangeTextFunc(e, setPassword);
                      }}
                      placeholder={'Пароль'}
                  />
                </View>
                <Text style={styles.error}>{error}</Text>
                <AppButton text={'Войти'} onPress={() => navigationFunc()} />
              </View>
              <View style={styles.footerContainer}>
                <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.titleTextSmall,
                      globalStyles.weightLight,
                    ]}>
                  Еще нет аккаунта?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate(SignupName)}>
                  <Text
                      style={[
                        globalStyles.titleText,
                        globalStyles.titleTextSmall,
                        styles.SignInTextBold,
                      ]}>
                    Создать аккаунт
                  </Text>
                </TouchableOpacity>
              </View>
            </AppForm>
          </View>
        </View>
        <Loading loading={loading} />
      </ScrollView>
  );
};
