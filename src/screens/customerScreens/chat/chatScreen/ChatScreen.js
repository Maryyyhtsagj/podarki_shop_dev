import {useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {styles} from './styles';
import {
    FlatList,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Colors, globalStyles, MessagesName} from '../../../../constants';
import {
    ChatData_,
    FinancialForm,
    globalHeight,
    globalWidth,
} from '../../../../components';
import {ChatForm} from '../../../../components/form/chatForm';
import axiosInstance from '../../../../networking/axiosInstance';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const isToday = dateString => {
    const inputDate = new Date(dateString);
    const today = new Date();

    // Приводим даты к локальному времени и обнуляем время
    const inputDay = new Date(inputDate).setHours(0, 0, 0, 0);
    const todayDay = new Date(today).setHours(0, 0, 0, 0);

    return inputDay === todayDay;
};
export const ChatScreen = ({navigation, route}) => {
    const customerData = useSelector(st => st.customer)
    const [active, setActive] = useState('За сегодня');
    const [data, setData] = useState([]);
    const [dataState, setDataState] = useState([]);
    const homeState = useSelector(state => state.homeState);
    const isFocused = useIsFocused()
    const sellerId = useSelector(state => state.user?.sellerId);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isFocused) {
            axiosFunc();
        }
    }, [isFocused]);

    useEffect(() => {
        if(!!homeState.messagesCount) {
            axiosFunc();
        }
    }, [homeState.messagesCount])

    const axiosFunc = async () => {
        try {
            const response = await axiosInstance.get(`/chat/im`);
            // const filterArr = response.data.filter((it) => it.priority === "admin");
            setData(response.data);
            changeStateFunc('За сегодня', response.data);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const createAdminChat = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/chat/is-created/admin?sellerId=${sellerId}`);

            if (response.data && response.data.chatId) {
                navigation.navigate(MessagesName, {
                    item: response.data.chatData,
                    state: true,
                });
            } else {
                const createResponse = await axiosInstance.post('/api/chat/create', {
                    priority: 'admin',
                    sellerId: sellerId
                });

                if (createResponse.data && createResponse.data.chatId) {
                    await axiosFunc();
                    navigation.navigate(MessagesName, {
                        item: createResponse.data.chatData,
                        state: true,
                    });
                }
            }
            setLoading(false);
        } catch (error) {
            console.log('Error creating admin chat:', error);
            setLoading(false);
        }
    };

    const changeStateFunc = (st, dataFunc) => {
        setLoading(true);

        // Создаем копию массива для иммутабельности
        const filteredData = [...dataFunc];

        switch (st) {
            case 'Тех.поддержка':
                setDataState(filteredData.filter(it => it.priority === 'admin'));
                break;
            case 'Все':
                setDataState(filteredData);
                break;
            case 'За сегодня':
                setDataState(filteredData.filter(it => isToday(it.date)));
                break;
        }

        setActive(st);
        setLoading(false);
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
            <View
                style={[
                    styles.headerContainer,
                    Platform.OS === 'ios' && {
                        paddingTop: getStatusBarHeight(true) + globalWidth(15),
                    },
                ]}>
                <Text
                    style={[
                        globalStyles.titleText,
                        globalStyles.textAlignLeft,
                        globalStyles.weightBold,
                        globalStyles.titleTextBig,
                        {paddingTop: Platform.OS === 'ios' ? globalHeight(10) : 0},
                    ]}>
                    Сообщения
                </Text>
                <View style={[globalStyles.row, styles.headerFooter]}>
                    <TouchableOpacity
                        style={active === 'За сегодня' && styles.activeText}
                        onPress={() => changeStateFunc('За сегодня', data)}>
                        <Text
                            style={[
                                globalStyles.titleText,
                                globalStyles.weightLight,
                                globalStyles.titleTextSmall,
                                styles.headerFooterText,
                                active === 'За сегодня' && styles.activeTextContent,
                            ]}>
                            За сегодня
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={active === 'Все' && styles.activeText}
                        onPress={() => changeStateFunc('Все', data)}>
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
                    <TouchableOpacity
                        style={active === 'Тех.поддержка' && styles.activeText}
                        onPress={() => {
                            changeStateFunc('Тех.поддержка', data);
                            createAdminChat();
                        }}>
                        <Text
                            style={[
                                globalStyles.titleText,
                                globalStyles.weightLight,
                                globalStyles.titleTextSmall,
                                styles.headerFooterText,
                                active === 'Тех.поддержка' && styles.activeTextContent,
                            ]}>
                            Тех.поддержка
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={dataState}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <ChatForm
                        item={item}
                        navigation={navigation}
                        onUpdate={axiosFunc}
                    />
                )}
            />
        </View>
    );
};
