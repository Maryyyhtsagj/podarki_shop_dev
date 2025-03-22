import React, {useState, useRef, useEffect} from 'react';
import {styles} from './styles';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Loading,
  BackButton,
  AppInput,
  globalWidth,
  ChooseImage,
} from '../../../../components';
import {
  ProfileScreenName,
  SET_CUSTOMER,
  WaitingName,
  globalStyles,
  BaseUrl,
  imageUrl,
} from '../../../../constants';
import axiosInstance from '../../../../networking/axiosInstance';
import sendIcon from '../../../../assets/images/sendIcon.png';
import ChatPlus from '../../../../assets/images/ChatPlus.png';
import {checkTokens} from '../../../../utils';

import io from 'socket.io-client';

import {useDispatch, useSelector} from 'react-redux';
import ImageView from 'react-native-image-viewing';

let socketNew = null;

export const MessagesScreen = ({navigation, route}) => {
  const [chat, setChat] = useState([]);
  const [addInput, setAddInput] = useState('');
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const [scrollToEnd, setScrollToEnd] = useState(true);
  const scrollViewRef = useRef();
  const dispatch = useDispatch();
  const store = useSelector(st => st.customer);
  const [token, setToken] = useState('');
  const [active, setActive] = useState(false);
  const [activeImage, setActiveImage] = useState({});
  const user = route.params?.item;
  const state = route.params?.state;
  const url1 = 'http://79.174.80.241:3001/api/chat/user';

  useEffect(() => {
    setTokFunc();
    socketConnectFunc();
    return () => {
      if (socketNew) {
        socketNew.disconnect();
      }
    };
  }, []);
  const [loading, setLoading] = useState(false);

  const setTokFunc = async () => {
    setVisible(true);
    let token = await checkTokens();
    setToken(token);
    socketConnectFunc(token);
  };

  const socketConnectFunc = token => {
    socketNew = io(url1, {
      query: {
        token: token,
        seller_id: store._id,
        buyer_id: user?.user_id?._id ? user.user_id._id : user._id,
        roomId: user.chatID,
      },
    });
    socketNew.on('connect', () => {
      socketNew.emit('getMessage');
    });
    getMessageFunc();
  };

  const getMessageFunc = () => {
    socketNew.on('messages', messages => {
      const arr = messages.messages;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].isImage) {
          arr[i].play = false;
        }
      }
      setChat([...arr]);
      setVisible(false);
      setScrollToEnd(true);
      const lastMessageId = arr[arr.length - 1]?._id;
      socketNew.emit('isRead', {message: lastMessageId, userToken: token, role: 'seller'});
    });

    socketNew.on('new-message', newMessage => {
      console.log('Received new message:', newMessage);
      setChat(prev => [...prev, newMessage]);
      setScrollToEnd(true);
    });
  };

  const handleEve = mess => {
    if (addInput) {
      const newMessage = {
        _id: `${Date.now()}`,
        text: mess,
        isImage: false,
        role: 'seller',
        isRead: false,
        time: new Date().toLocaleTimeString(),
        room_id: user.chatID,
        date: new Date().toISOString(),
      };
      setChat(prev => [...prev, newMessage]);
      socketNew.emit('sendMessage', {text: mess});
      setScrollToEnd(true);
      console.log('Message emitted:', newMessage);

    }
  };

  const requestCameraPermission = () => {
    try {
      console.log('Requesting camera permission...');
      ChooseImage(async imageRes => {
        if (!imageRes.didCancel) {
          console.log('Sending image:', imageRes.assets[0].base64);
          socketNew.emit(
              'send-img',
              `data:image/png;base64,${imageRes.assets[0].base64}`,
          );
        }
      });
    } catch (err) {
      console.error('Error requesting camera permission:', err);
    }
  };
  return (
      <View style={styles.chatScrool}>
        <BackButton
            text={user?.user_id?.full_name ? user.user_id.full_name : user?.name}
            navigation={navigation}
            stylesBack={styles.backContainer}
        />
        <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            ref={scrollViewRef}
            onContentSizeChange={() => {
              if (scrollToEnd && chat.length) {
                scrollViewRef.current.scrollToEnd({
                  y: 0,
                  animated: true,
                });
                setScrollToEnd(false);
              }
            }}>
          {chat.map((item, index) => {
            if (!item.isImage && (!item.text || item.text.trim() === '')) return null;
            return (
                <View
                    style={[
                      styles.placeHolderImageViewText,
                      {
                        alignItems:
                            item.role !== 'user' || item.role === 'admin'
                                ? 'flex-end'
                                : 'flex-start',
                      },
                    ]}
                    key={index}>
                  <View
                      style={[
                        styles.content,
                        item.role !== 'user' || item.role === 'admin'
                            ? styles.left
                            : styles.right,
                      ]}
                      key={index}>
                    {item.isImage ? (
                        <TouchableOpacity
                            onPress={() => {
                              if (!item.play) {
                                setActiveImage([{uri: imageUrl + item.text}]);
                                setActive(true);
                              }
                            }}>
                          {item.play ? (
                              <ActivityIndicator
                                  size={40}
                                  color={'#569690'}
                                  style={{
                                    position: 'absolute',
                                    zIndex: 10,
                                    bottom: 0,
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                  }}
                              />
                          ) : null}
                          <Image
                              onLoadStart={e => {
                                item.play = true;
                                setChat([...chat]);
                              }}
                              onLoad={e => {
                                item.play = false;
                                setChat([...chat]);
                              }}
                              onLoadEnd={e => {
                                item.play = false;
                                setChat([...chat]);
                              }}
                              source={{uri: imageUrl + item.text}}
                              style={styles.imgMsg}
                          />
                        </TouchableOpacity>
                    ) : (
                        <View style={globalStyles.messageContainer} key={index}>
                          <Text
                              style={[
                                globalStyles.weightLight,
                                globalStyles.titleTextBig,
                                {color: 'white'},
                              ]}>
                            {item.text}
                          </Text>
                          <Text
                              style={[
                                globalStyles.timeText,
                                globalStyles.weightLight,
                                {
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  textAlign: 'right',
                                  color: 'black',
                                },
                              ]}>
                            {item.time.slice(0, 5)}{' '}
                          </Text>
                        </View>
                    )}
                  </View>
                </View>
            );
          })}
        </ScrollView>
        <View style={styles.chatInputView}>
          {!state ? (
              <TouchableOpacity
                  onPress={requestCameraPermission}
                  key="cameraButton">
                <Image source={ChatPlus} style={styles.chatPlusImg} />
              </TouchableOpacity>
          ) : null}
          <AppInput
              style={styles.textInputChat}
              value={addInput}
              onChangeText={evt => {
                setAddInput(evt);
                setText('');
              }}
              key="textInput"
          />
          <TouchableOpacity
              style={styles.chatIconContainer}
              onPress={() => {
                handleEve(addInput);
                setAddInput('');
              }}
              key="sendButton">
            <Image source={sendIcon} style={styles.chatIcon} />
          </TouchableOpacity>
        </View>
        <ImageView
            images={activeImage}
            imageIndex={0}
            visible={active}
            onRequestClose={() => {
              setActive(false);
              setActiveImage({});
            }}
        />
        <Loading loading={visible} />
      </View>
  );
};
