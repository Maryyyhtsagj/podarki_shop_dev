import {useIsFocused} from '@react-navigation/native';
import {login} from 'npm/lib/utils/auth';
import React, {useState, useEffect} from 'react';
import {styles} from './styles';
import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, globalStyles} from '../../../../constants';
import {
  ApplicationsData_,
  ApplicationsForm,
  FilterForm,
  globalWidth,
} from '../../../../components';
import {useSelector} from 'react-redux';
import axiosInstance from '../../../../networking/axiosInstance';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const AplicationsScreen = ({navigation}) => {

  const url = 'http://79.174.80.241:3001/api/socket/orders/seller'; //socket for upd orders

  const sellerId = useSelector(state => {
    return state.customer?._id;
  });

  const store = useSelector(st => st.customer);
  const shop = store.active_store;
  const [orders, setOrders] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [banner, setBanner] = useState('');
  const [active, setActive] = useState('Сегодня');
  const isFocused = useIsFocused()
  const [sort, setSort] = useState([
    {
      id: 1,
      name: 'Все',
      check: true,
      key: 'all',
      amount: 0,
    },
    {
      id: 2,
      name: 'Новые',
      check: false,
      key: 'accepted',
      amount: 0,
    },
    {
      id: 3,
      name: 'Заказ принят',
      check: false,
      key: 'approved',
      amount: 0,
    },
    {
      id: 4,
      name: 'Заказ в сборке',
      check: false,
      key: 'assembling',
      amount: 0,
    },
    {
      id: 5,
      name: 'Заказ в пути',
      check: false,
      key: 'in_transit',
      amount: 0,
    },
    {
      id: 6,
      name: 'Заказ завершен',
      check: false,
      key: 'completed',
      amount: 0,
    },
    {
      id: 7,
      name: 'Заказ отменен',
      check: false,
      key: 'cancelled',
      amount: 0,
    },
  ]);
  let [sortActive, setSortActive] = useState({});

  useEffect(() => {
    setSortActive({
      id: 10,
      name: 'Все',
      check: false,
      key: 'all',
      amount: orders.length,
    });
    checkFilterSort(0);
  }, [active]);

  const axiosFunc = async arr => {
    console.log('Received array:', arr);

    for (let i = 0; i < sort.length; i++) {
      sort[i].amount = 0;
    }
    try {
      arr.map((item, index) => {
        if (!item.status_id) {
          item.status_id = {
            name: 'accepted',
            title: 'Ожидает подтверждения'
          };
        }

        if (item.status_id.name === 'approved') {
          item.status_id.title = 'Заказ принят';
        } else if (item.status_id.name === 'assembling') {
          item.status_id.title = 'Заказ в сборке';
        } else if (item.status_id.name === 'accepted') {
          item.status_id.title = 'Ожидает подтверждения';
        } else if (item.status_id.name === 'in_transit') {
          item.status_id.title = 'Заказ в пути';
        } else if (item.status_id.name === 'completed') {
          item.status_id.title = 'Заказ завершен';
        } else if (item.status_id.name === 'cancelled') {
          item.status_id.title = 'Заказ отменен';
        }

        return item;
      });

      for (let i = 0; i < sort.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].status_id.name === sort[i].key) {
            sort[i].amount++;
          } else if (sort[i].name === 'Все') {
            sort[i].amount = arr.length;
          }
        }
      }

      console.log('Setting orders:', arr);
      setOrders(arr);
      setOrdersData([...arr]);

      setSortActive({
        id: 10,
        name: 'Все',
        check: false,
        key: 'all',
        amount: arr.length,
      });
    } catch (e) {
      console.error('Error in axiosFunc:', e);
    }
  };

  useEffect(() => {
    if(isFocused) {
      changeStateFunc(active);
      getBanner();
    }
  }, [navigation, isFocused]);

  useEffect(() => {
    if (!active) {
      changeStateFunc(active);
    }
  }, [active]);

  const getBanner = async () => {
    try {
      const response = await axiosInstance.get('/goods/banner');
      setBanner(response.data.banner);
    } catch (e) {
      console.log(e);
    }
  };

  let checkFilterSort = index => {
    let arr = [];
    for (let i = 0; i < sort.length; i++) {
      sort[i].check = false;
    }
    sort[index].check = true;
    setSort([...sort]);
    if (sort[index].key !== 'all') {
      for (let i = 0; i < ordersData.length; i++) {
        if (ordersData[i].status_id.name === sort[index].key) {
          arr.push(ordersData[i]);
        }
      }
      setOrders([...arr]);
    } else {
      setOrders([...ordersData]);
    }
    setSortActive({...sort[index]});
  };


  const changeStateFunc = async st => {
    setActive(st);
    try {
      console.log('Fetching orders for store:', shop._id);
      const response = await axiosInstance.post('orders/by-store', {
        store_id: shop._id,
      });

      console.log('Full API response:', response.data);

      setSortActive({});
      setOrders([]);
      setOrdersData([]);
      const arr = response.data;

      if (st === 'Сегодня') {
        const currentDate = new Date();
        let filterArr = arr.filter(
            item => new Date(item.delivery_date).toDateString() === currentDate.toDateString()
        );
        console.log('Today\'s orders:', filterArr);
        await axiosFunc([...filterArr]);
      } else if (st === 'Завтра') {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() + 1);
        let filterArr = arr.filter(
            item => new Date(item.delivery_date).toDateString() === oneDayAgo.toDateString()
        );
        console.log('Tomorrow\'s orders:', filterArr);
        await axiosFunc([...filterArr]);
      } else if (st === 'Все') {
        console.log('All orders:', arr);
        await axiosFunc(arr);
      }
    } catch (e) {
      console.error('Error in changeStateFunc:', e);
      // Optionally show an error to the user
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
        <View style={[styles.container]}>
          <View
              style={[
                styles.headerContainer,
                Platform.OS === 'ios' && {
                  paddingTop: getStatusBarHeight(true) + globalWidth(25),
                },
              ]}>
            <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.textAlignLeft,
                  globalStyles.weightBold,
                  globalStyles.titleTextBig,
                  styles.textZakaz,
                ]}>
              Заказы
            </Text>
            <View style={[globalStyles.row, styles.headerFooter]}>
              <TouchableOpacity
                  style={active === 'Сегодня' && styles.activeText}
                  onPress={() => changeStateFunc('Сегодня')}>
                <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.weightLight,
                      globalStyles.titleTextSmall,
                      styles.headerFooterText,
                      active === 'Сегодня' && styles.activeTextContent,
                    ]}>
                  Сегодня
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={active === 'Завтра' && styles.activeText}
                  onPress={() => changeStateFunc('Завтра')}>
                <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.weightLight,
                      globalStyles.titleTextSmall,
                      styles.headerFooterText,
                      active === 'Завтра' && styles.activeTextContent,
                    ]}>
                  Завтра
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={active === 'Все' && styles.activeText}
                  onPress={() => changeStateFunc('Все')}>
                <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.weightLight,
                      globalStyles.titleTextSmall,
                      styles.headerFooterText,
                      active === 'Все' && styles.activeTextContent,
                    ]}>
                  Все
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              bounces={false}>
            {sort.map((item, index) => {
              return (
                  <FilterForm
                      st
                      item={item}
                      index={index}
                      key={index}
                      check={checkFilterSort}
                  />
              );
            })}
          </ScrollView>
        </View>
        {Object.keys(ApplicationsData_).length ? (
            <FlatList
                data={orders}
                renderItem={({item, index}) => {
                  return (
                      <ApplicationsForm
                          item={item}
                          key={index}
                          navigation={navigation}
                          orders={orders}
                          banner={banner}
                      />
                  );
                }}
            />
        ) : (
            <View>
              <Text
                  style={[
                    globalStyles.titleText,
                    globalStyles.weightLight,
                    globalStyles.titleTextSmall,
                    styles.noDataText,
                  ]}>
                Нет активных заказов, нажмите на фильтр “Все”
              </Text>
            </View>
        )}
      </View>
  );
};
