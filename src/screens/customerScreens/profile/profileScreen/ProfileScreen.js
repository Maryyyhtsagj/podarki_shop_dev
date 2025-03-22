import React, {useEffect, useState} from 'react';
import {agreementText, privacyText} from '../../../authScreens/signupScreen/SignupScreen';
import {styles} from './styles';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import rightIcon from '../../../../assets/images/rightIcon.png';
import bottomIcon from '../../../../assets/images/bottomIcon.png';
import shopIcon from '../../../../assets/images/shopIcon.png';
import place from '../../../../assets/images/wing.png';
import {
  BaseUrl,
  Colors,
  CreateShopName,
  FinancialReportName,
  globalStyles,
  MyDetailsScreenName,
  PromotionServicesName,
  ShopDataName,
  LoremName,
  imageUrl,
} from '../../../../constants';
import {ChangeShopModal, globalHeight, Loading} from '../../../../components';
import axiosInstance from '../../../../networking/axiosInstance';
import {useSelector} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const ProfileScreen = ({navigation}) => {
  const store = useSelector(st => st.customer);
  const shop = store.active_store;
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allShop, setAllShop] = useState([]);
  const [state, setState] = useState(false);
  const shopChangeFunc = val => {
    shopChangeFunc({...val});
  };
  useEffect(() => {
    allShopFunc();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkActiveFunc();
    });
  }, [navigation]);

  useEffect(() => {
    checkActiveFunc();
  }, [store]);

  const loadingFunc = val => setLoading(val);
  const modalFunc = state => setModalState(state);
  const navigationFunc = nav => {
    navigation.navigate(nav);
  };
  const createShopFunc = () => {
    navigation.navigate(CreateShopName, {state: true});
  };

  const checkActiveFunc = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/check-sub?store_id=${shop._id}`,
      );
      setState(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const allShopFunc = async () => {
    try {
      const response = await axiosInstance.get('/stores/my');
      setAllShop([...response.data]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={[
        globalStyles.container,
        Platform.OS === 'ios' && {marginTop: -(getStatusBarHeight(true) + 8)},
      ]}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={Colors.blueBackground}
      />
      <ScrollView
        contentContainerStyle={[globalStyles.scrollContainer]}
        bounces={false}>
        <View
          style={[
            styles.headerContainer,
            Platform.OS === 'ios' && {
              paddingTop: getStatusBarHeight(true) + globalHeight(30),
            },
          ]}>
          <View style={[styles.headerShop, globalStyles.row]}>
            <View style={globalStyles.row}>
              <Image
                source={{uri: imageUrl + '/' + shop?.logo_url}}
                style={styles.shopIcon}
              />
              <View style={styles.containerHeaderText}>
                <Text style={styles.magazine}>Магазин</Text>
                <Text style={styles.shopName}>{shop?.title}</Text>
                <View style={globalStyles.row}>
                  <Image source={place} style={styles.placeIcon} />
                  <Text style={styles.placeTextNew}>
                    {shop?.city} / {shop?.address}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.containerRight}>
              <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.weightLight,
                  styles.placeText,
                  styles.idText,
                ]}>
                ID:
                {shop?._id?.substring(15)}
              </Text>
            </View>
          </View>
          <View style={styles.addShopContainer}>
            <TouchableOpacity
              style={styles.changeShop}
              onPress={() => modalFunc(true)}>
              <Text style={[globalStyles.weightLight, styles.headerFooterText]}>
                Выбрать другой магазин
              </Text>
              <Image source={bottomIcon} style={styles.bottomIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => createShopFunc()}>
              <Text
                style={[
                  styles.headerFooterText,
                  styles.changeColorStyle,
                  globalStyles.weightLight,
                ]}>
                Добавить магазин+
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.activeInActiveContainer]}
            onPress={() => navigation.navigate(PromotionServicesName, {state})}>
            <View style={styles.activeContainer}>
              <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.textAlignLeft,
                  globalStyles.titleTextSmall4,
                  styles.activeTextHeader,
                ]}>
                Услуги продвижения:
              </Text>
              {state ? (
                <Text
                  style={[
                    globalStyles.titleText,
                    globalStyles.textAlignLeft,
                    globalStyles.titleTextSmall,
                    styles.activeTextState,
                  ]}>
                  АКТИВНА
                </Text>
              ) : (
                <Text
                  style={[
                    globalStyles.titleText,
                    globalStyles.textAlignLeft,
                    globalStyles.titleTextSmall,
                    styles.activeText,
                  ]}>
                  НЕАКТИВНА
                </Text>
              )}
            </View>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate(ShopDataName, {shop})}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Описание магазина
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigationFunc(FinancialReportName)}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Финансовый отчет
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigationFunc(MyDetailsScreenName)}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Мои данные
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.navigate(LoremName, {
                name: 'Частые вопросы',
                text: `1. Как правильно заполнить все данные в профиле?
При заполнении профиля указывайте максимальное количество информации о вашем магазине. Чем точнее и подробнее заполнен профиль, тем больше клиентов обратят внимание на магазин.

Укажите название вашего магазина и его точный адрес.
Сделайте краткое описание, загрузите логотип (без водяных знаков и контактов для связи).
Укажите Ваш график работы. В профиле можно указать любой график работы, соответствующий реальным возможностям принятия и доставки заказов.
Дайте точные контакты для связи с магазином: номер телефона, рабочий e-mail.
Заполните «Условия доставки».
Заполните данные вашего юридического лица, ИП или Самозанятости в пределах РФ или введите данные для партнеров за пределами РФ.
Добавьте минимум 5 товаров в каталог.
 
2. Как указать условия доставки?
На данный момент за доставку заказа отвечает продавец. В разделе “Доставка” Вам необходимо указать стоимость доставки за 1 км, и на основании этих данных приложение будет рассчитывать стоимость доставки до получателя. Также можно указывать бесплатную доставку, но при этом учитывать ее в стоимости товара. При этом бесплатная доставка будет осуществляться в диаметре 5 км от вашего адреса. На более длительные расстояния оплата за доставку должна быть осуществлена с помощью заказчика.

3. Как работать с заказом?
Когда Вам поступает заказ, вы получите уведомление. Вам необходимо принять заказ в приложении, поменяв при этом его статус на “Принят”.

После принятия заказа его нужно собрать и подготовить для отправки к назначенной дате и времени получателю. При необходимости можно связаться с получателем, данные которого указаны в заказе. После сборки необходимо сменить статус заказа на “Собран”. Далее отправляете на доставку с вашим курьером и так же меняете статус на “Доставляется”. После того, как курьер доставит заказ получателю, необходимо сменить статус на “Заказ доставлен”

4. Могут ли самозанятые размещать товары на вашей площадке?
Да, мы работаем с физическими лицами, получившими статус Самозанятого. Самозанятое физлицо может продавать товары только своего производства, например, товары ручной работы или кондитерские изделия. Перепродажа товаров для самозанятых не подходит.

5. Как я получу оплату за заказ?
Заказчик оплачивает товар сразу при оформлении заказа, средства поступают на ваш личный счет в приложении уже за минусом нашей и банковской комиссии. Выплаты с вашего личного счета на банковский счет происходят один раз в неделю, по средам, за прошедшую неделю.

6. Как рассчитывается комиссия за услуги приложения?
Комиссия — это способ оплаты предоставляемых нами услуг по оптимизации платформы и приложения, рекламных кампаний, привлечению клиентов. Размер комиссия зависит от города и категории магазина. Это можно узнать в оферте к приложению.

Комиссия взимается автоматически от каждого оплаченного клиентом товара в заказе. За доставку и доплату комиссия не взимается. Информация о комиссии отражена в детализации по каждому заказу в личном кабинете.`
              });
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Частые вопросы
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.navigate(LoremName, {
                name: 'Политика конфиденциальности',
                text: privacyText
              });
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Политика конфиденциальности
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.navigate(LoremName, {
                name: 'Соглашение об обработке персональных данных',
                text: agreementText
              });
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Условия использования приложения
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.navigate(LoremName, {
                name: 'О приложении',
                text: 'Seller Дари ВКайф v1.0.0'
              });
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              О приложении
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
        </View>
        <ChangeShopModal
          visible={modalState}
          modalFunc={modalFunc}
          setModalState={setModalState}
          loadingFunc={loadingFunc}
          propsNavigation={navigation}
          allShop={allShop}
        />
      </ScrollView>
      <Loading loading={loading} />
    </View>
  );
};
