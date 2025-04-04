import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import {
    FlatList,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, globalStyles, MessagesName } from '../../../../constants';
import {
    ChatData_,
    FinancialForm,
    globalHeight,
    globalWidth,
} from '../../../../components';
import { ChatForm } from '../../../../components/form/chatForm';
import axiosInstance from '../../../../networking/axiosInstance';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const isToday = dateString => {
    const inputDate = new Date(dateString);
    const today = new Date();
    const inputDay = new Date(inputDate).setHours(0, 0, 0, 0);
    const todayDay = new Date(today).setHours(0, 0, 0, 0);
    return inputDay === todayDay;
};

export const ChatScreen = ({ navigation, route }) => {
    const customerData = useSelector(st => st.customer);
    const [active, setActive] = useState('За сегодня');
    const [data, setData] = useState([]);
    const [dataState, setDataState] = useState([]);
    const homeState = useSelector(state => state.homeState);
    const isFocused = useIsFocused();
    const sellerId = useSelector(state => {
        console.log('Redux user state:', state.customer?._id);
        return state.customer?._id;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isFocused) {
            axiosFunc();
        }
    }, [isFocused]);

    useEffect(() => {
        if (homeState.messagesCount) {
            axiosFunc();
        }
    }, [homeState.messagesCount]);

    const axiosFunc = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/chat/im');
            console.log('Chat list response:', response.data);
            setData(response.data);
            changeStateFunc('За сегодня', response.data);
        } catch (e) {
            console.log('Error fetching chats:', e.message);
            if (e.response) {
                console.log('Error response:', e.response.status, e.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const createAdminChat = async () => {
        if (!sellerId) {
            console.log('Error: sellerId is undefined');
            return;
        }

        try {
            setLoading(true);
            console.log('Checking/creating admin chat for sellerId:', sellerId);
            const checkResponse = await axiosInstance.get(`/chat/is-created/admin`, {
                params: { seller_id: sellerId },
            });

            console.log('Admin chat response:', checkResponse.data);

            if (checkResponse.data && checkResponse.data.chatID) {
                navigation.navigate(MessagesName, {
                    item: {
                        _id: checkResponse.data.chatID,
                        chatID: checkResponse.data.chatID,
                        priority: 'admin',
                        date: new Date().toISOString(),
                    },
                    state: false,
                });
                await axiosFunc();
            } else {
                console.log('No chatID returned from /chat/is-created/admin');
            }
        } catch (error) {
            console.log('Error creating admin chat:', error.message);
            if (error.response) {
                console.log('Error response:', error.response.status, error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const changeStateFunc = (st, dataFunc) => {
        setLoading(true);
        const filteredData = [...dataFunc];

        switch (st) {
            case 'Тех.поддержка':
                setDataState([]);
                break;
            case 'Все':
                // Show all chats except the admin chat (if desired)
                setDataState(filteredData);
                break;
            case 'За сегодня':
                // Show chats from today except the admin chat (if desired)
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
                Platform.OS === 'ios' && { marginTop: -(getStatusBarHeight(true) + 8) },
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
                        { paddingTop: Platform.OS === 'ios' ? globalHeight(10) : 0 },
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
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
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
