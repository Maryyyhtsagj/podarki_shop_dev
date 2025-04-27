import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { Colors, FilterName, globalStyles, PromotionServicesName } from '../../../../constants';
import { Loading, FormGoods, SwitchTogglesCustom, ArciveModal } from '../../../../components';
import { FlatList, Image, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FilterIcon from '../../../../assets/images/filter.png';
import bottomIcon from '../../../../assets/images/bottomIcon.png';
import winIcon from '../../../../assets/images/winIcon.png';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../networking/axiosInstance';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const HomeScreen = ({ navigation }) => {
  const store = useSelector((st) => st.customer);
  const filter = useSelector((st) => st.filter);
  const shop = store.active_store;
  const [loading, setLoading] = useState(false);
  const [goodsData, setGoodsData] = useState([]);
  const [shopId, setSopId] = useState('');
  const [promotNum, setPromotNum] = useState(0);
  const [stateArcive, setStateArcive] = useState(false);
  const [textArcive, setTextArcive] = useState('Все');

  useEffect(() => {
    if (Object.keys(filter).length) {
      getFilter();
    } else {
      getGoods();
    }
  }, [store, filter]);

  const getGoods = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/goods?store_id=${shop._id}`);
      setGoodsData(response.data);
      setSopId(shop._id);
      numberAllGoodsFunc(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e.response?.data || e);
      setLoading(false);
    }
  };

  const getFilter = async () => {
    try {
      setLoading(true);
      let params = [`store_id=${store.active_store._id}`];
      if (filter.category_id) params.push(`category=${filter.category_id}`);
      if (filter.subcategory) params.push(`subcategory=${filter.subcategory}`);
      if (filter.sort) params.push(`sort=${filter.sort}`);
      if (textArcive === 'Архив') params.push(`stock=false`);

      const url = `/goods?${params.join('&')}`;
      const response = await axiosInstance.get(url);
      setGoodsData(response.data);
      numberAllGoodsFunc(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e.response?.data || e);
      setLoading(false);
    }
  };

  const onPressFuncArcive = (st, st1) => {
    setTextArcive(st1);
    setLoading(true);
    setStateArcive(false);

    if (st1 === 'Все') {
      getGoods();
    } else {
      getFilter(); // Reuse getFilter to apply stock=false when "Архив" is selected
    }
  };

  const numberAllGoodsFunc = (data) => {
    const pro = data.filter((item) => item.is_promoted).length;
    setPromotNum(pro);
  };

  const proFunc = (n) => setPromotNum((prev) => prev + n);

  const navigateToPromotion = (state) => {
    navigation.navigate(PromotionServicesName, { state });
  };

  return (
      <View
          style={[
            globalStyles.container,
            Platform.OS === 'ios' && { marginTop: -(getStatusBarHeight(true) + 8) },
          ]}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.blueBackground} />
        <View
            style={[
              styles.headerContainer,
              Platform.OS === 'ios' && { paddingTop: getStatusBarHeight(true) + 8 },
            ]}
        >
          <View style={styles.headerTextContainer}>
            <Text style={[globalStyles.titleText, globalStyles.titleTextBig]}>
              Мои товары
            </Text>
            <Text style={[globalStyles.titleText, globalStyles.titleTextSmall]}>
              {goodsData.length} шт
            </Text>
          </View>
          <View style={styles.headerContent}>
            <TouchableOpacity
                style={styles.filterContainer}
                onPress={() => navigation.navigate(FilterName)}
            >
              <Text
                  style={[
                    styles.filterTextStyle,
                    globalStyles.titleText,
                    globalStyles.weightLight,
                    globalStyles.titleTextSmall,
                  ]}
              >
                Фильтры
              </Text>
              <Image source={FilterIcon} style={styles.filterIconStyle} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.filterContainerFill}
                onPress={() => setStateArcive(true)}
            >
              <Text
                  style={[
                    styles.filterTextStyle,
                    globalStyles.titleText,
                    globalStyles.weightLight,
                    globalStyles.titleTextSmall,
                  ]}
              >
                {textArcive}
              </Text>
              <Image source={bottomIcon} style={styles.bottomIconStyle} />
            </TouchableOpacity>
          </View>
          <View style={styles.HeaderFooter}>
            <Image source={winIcon} style={styles.winIconStyle} />
            <Text
                style={[
                  styles.headerFooterText,
                  globalStyles.titleText,
                  globalStyles.titleTextSmall,
                  styles.prod,
                ]}
            >
              Товары с продвижением: {promotNum} шт
            </Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <FlatList
              data={goodsData}
              renderItem={({ item, index }) => (
                  <FormGoods
                      item={item}
                      key={index}
                      navigation={navigation}
                      proFunc={proFunc}
                      navigateToPromotion={navigateToPromotion}
                  />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              numColumns={2}
          />
        </View>
        <Loading loading={loading} />
        <ArciveModal
            visible={stateArcive}
            modalFunc={setStateArcive}
            onPressFuncArcive={onPressFuncArcive}
        />
      </View>
  );
};
