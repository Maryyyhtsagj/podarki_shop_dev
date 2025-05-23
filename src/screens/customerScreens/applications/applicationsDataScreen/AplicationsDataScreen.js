import React, {useState, useEffect} from 'react';
import {styles} from './styles';
import {
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    BaseUrl,
    Colors,
    globalStyles,
    imageUrl,
    MessagesName,
} from '../../../../constants';
import axiosInstance from '../../../../networking/axiosInstance';
import postCardImg from '../../../../assets/images/postCard.png';

import {
    ApplicationsChangeForm,
    BackButton,
    HomeFormData,
} from '../../../../components';
import messageIcon from '../../../../assets/images/chatIcon.png';
import SelectDropdown from 'react-native-select-dropdown';
import store from '../../../../store';
import {useSelector} from 'react-redux';
import category_bottom from '../../../../assets/images/categroy_bottom.png';

export const ApplicationsDataScreen = ({navigation, route}) => {
    const item = route.params.item;

    let itemCount = item.count[0].count;
    const orders = route.params.orders;
    const store = useSelector(st => st.customer);

    const [status, setStatus] = useState([]);
    const [statusName, setStatusName] = useState(null);
    useEffect(() => {
        statusDataFetch();
    }, []);
    const statusDataFetch = async () => {
        try {
            const response = await axiosInstance.get('/orders/status');
            let arr = response.data;

            const acceptedIndex = arr.findIndex(item => item.name === 'accepted');
            if (acceptedIndex !== -1) {
                const acceptedItem = arr.splice(acceptedIndex, 1)[0];
                arr.unshift(acceptedItem);
            }

            arr.forEach(item => {
                switch (item.name) {
                    case 'accepted':
                        item.title = 'Ожидает подтверждения';
                        break;
                    case 'approved':
                        item.title = 'Заказ принят';
                        break;
                    case 'assembling':
                        item.title = 'Заказ в сборке';
                        break;
                    case 'pending':
                        item.title = 'Заказ подтвержден';
                        break;
                    case 'in_transit':
                        item.title = 'Заказ в пути';
                        break;
                    case 'completed':
                        item.title = 'Заказ завершен';
                        break;
                    case 'cancelled':
                        item.title = 'Заказ отменен';
                        break;
                    default:
                        break;
                }
            });
            setStatus(arr);
            setStatusFunc(arr);
        } catch (e) {
            console.log(e);
        }
    };

    const messageFunc = async () => {
        try {
            const response = await axiosInstance.get(
                `/chat/seller/is-created?buyer_id=${item?.user_id._id}`,
            );
            navigation.navigate(MessagesName, {
                item: {
                    _id: item?.user_id._id,
                    seller_id: store._id,
                    chatID: response?.data?.chatID,
                    ...item,
                },
            });
        } catch (e) {
            console.log('chat/seller/is-created?buyer_id error', e);
        }
    };

    const setStatusFunc = arr => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === item.status_id.name) {
                setStatusName(arr[i]);
            }
        }
    };
    const changeStatusFunc = async it => {
        setStatusName(it);
        const data = {
            status_id: it._id,
        };
        try {
            const response = await axiosInstance.post(
                `/orders/update-status?order_id=${item._id}`,
                data,
            );
        } catch (e) {
            console.log(e);
        }
    };

    let components = item.delivery_date.split('-');

    // Получаем значения года, месяца и дня
    let year = components[0];
    let month = components[1];
    let day = components[2];

    // Форматируем дату в необходимый формат "день, месяц, год"
    let formattedDate = day + '.' + month + '.' + year;

    return (
        <ScrollView
            contentContainerStyle={[globalStyles.scrollContainer]}
            bounces={false}>
            <StatusBar
                barStyle="dark-content"
                hidden={false}
                backgroundColor={Colors.blueBackground}
            />
            <View style={styles.headerContainer}>
                <View style={styles.headerPadding}>
                    <BackButton
                        text={'Заказ'}
                        navigation={navigation}
                        applications={item.N}
                        stylesBack={styles.back}
                    />
                    <Text
                        style={[
                            globalStyles.titleText,
                            globalStyles.weightLight,
                            globalStyles.titleTextSmall,
                            globalStyles.textAlignRight,
                            item.state && {color: '#E38920'},
                        ]}>
                        {item.state}
                    </Text>
                </View>
                <View style={[styles.headerTextContainer, styles.headerPadding]}>
                    {item.goods.map((item, index) => {
                        return (
                            <Text
                                key={index}
                                style={[
                                    globalStyles.titleText,
                                    globalStyles.textAlignLeft,
                                    styles.contentStyleText,
                                ]}>
                                x{itemCount} {item.title}
                            </Text>
                        );
                    })}
                </View>
                <View style={styles.headerBorderWidth}>
                    <View style={[styles.headerPadding]}>
                        <View style={[globalStyles.row, styles.between]}>
                            <View>
                                <View style={styles.contData}>
                                    <Text
                                        style={[
                                            globalStyles.titleText,
                                            globalStyles.weightLight,
                                            globalStyles.titleTextSmall,
                                            globalStyles.textAlignLeft,
                                        ]}>
                                        На когда
                                    </Text>
                                    <Text>{formattedDate}</Text>
                                </View>
                                <View>
                                    <Text
                                        style={[
                                            globalStyles.titleText,
                                            globalStyles.weightLight,
                                            globalStyles.titleTextSmall,
                                            globalStyles.textAlignLeft,
                                        ]}>
                                        Телефон
                                    </Text>
                                    <Text>{item.phone_number}</Text>
                                </View>
                            </View>
                            <View>
                                <View style={styles.contData}>
                                    <Text
                                        style={[
                                            globalStyles.titleText,
                                            globalStyles.weightLight,
                                            globalStyles.titleTextSmall,
                                            globalStyles.textAlignLeft,
                                        ]}>
                                        Время
                                    </Text>
                                    <Text>{item.delivery_time}</Text>
                                </View>
                                <View>
                                    <Text
                                        style={[
                                            globalStyles.titleText,
                                            globalStyles.weightLight,
                                            globalStyles.titleTextSmall,
                                            globalStyles.textAlignLeft,
                                        ]}>
                                        Общая сумма
                                    </Text>
                                    <Text>{item.full_amount.$numberDecimal} р</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.countryView}>
                            <Text
                                style={[
                                    globalStyles.titleText,
                                    globalStyles.weightLight,
                                    globalStyles.titleTextSmall,
                                    globalStyles.textAlignLeft,
                                ]}>
                                Город
                            </Text>
                            <Text>{item.delivery_city}</Text>
                        </View>
                        <View style={styles.countryView}>
                            <Text
                                style={[
                                    globalStyles.titleText,
                                    globalStyles.weightLight,
                                    globalStyles.titleTextSmall,
                                    globalStyles.textAlignLeft,
                                ]}>
                                Адрес
                            </Text>
                            <Text>
                                {item?.count[0]?.addressAll} {item.delivery_address}
                            </Text>
                        </View>
                        <View style={styles.countryView}>
                            <Text
                                style={[
                                    globalStyles.titleText,
                                    globalStyles.weightLight,
                                    globalStyles.titleTextSmall,
                                    globalStyles.textAlignLeft,
                                ]}>
                                Имя получателя
                            </Text>
                            <Text>{item.name}</Text>
                        </View>
                        <View style={styles.countryView}>
                            <Text
                                style={[
                                    globalStyles.titleText,
                                    globalStyles.weightLight,
                                    globalStyles.titleTextSmall,
                                    globalStyles.textAlignLeft,
                                ]}>
                                Комментарий
                            </Text>
                            <Text>{item.comment}</Text>
                        </View>
                    </View>
                </View>
            </View>
            {item.goods.map((item, index) => {
                return (
                    <ApplicationsChangeForm
                        item={item}
                        count={itemCount}
                        key={index}
                        index={index}
                        navigation={navigation}
                    />
                );
            })}
            <View style={styles.applicationsContainer}>
                <View style={styles.changeContent}>
                    <View style={[globalStyles.row]}>
                        <Image
                            source={{uri: imageUrl + '/' + route.params?.banner}}
                            style={styles.imgForm}
                        />
                        <View style={styles.openerCont}>
                            {/* <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.weightLight,
                  globalStyles.titleTextSmall,
                  globalStyles.textAlignLeft,
                ]}>
                Текст на открытке:
              </Text> */}
                            <Text
                                style={[
                                    globalStyles.titleText,
                                    globalStyles.weightBold,
                                    globalStyles.titleTextSmall,
                                    globalStyles.textAlignLeft,
                                    styles.priceText,
                                ]}>
                                {item.postcard}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.footerCont, globalStyles.row, {marginBottom: 15}]}>
                <View>
                    <View style={styles.dropCont}>
                        <SelectDropdown
                            data={status}
                            buttonStyle={styles.btnStyleDrop}
                            dropdownStyle={styles.categoryInput}
                            defaultButtonText={statusName?.title}
                            rowTextStyle={styles.choosePhotoText}
                            onSelect={selectedItem => {
                                changeStatusFunc(selectedItem);
                            }}
                            buttonTextAfterSelection={selectedItem => {
                                return selectedItem.title;
                            }}
                            rowTextForSelection={selectedItem => {
                                return selectedItem.title;
                            }}
                        />
                    </View>
                    <View style={styles.catCont}>
                        <Text
                            style={[
                                globalStyles.titleText,
                                globalStyles.titleTextSmall,
                                styles.textCat,
                            ]}>
                            {statusName?.title}
                        </Text>
                        <Image source={category_bottom} style={styles.category_bottom} />
                    </View>
                </View>

                <TouchableOpacity onPress={messageFunc}>
                    <Image source={messageIcon} style={styles.messageIcon} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
