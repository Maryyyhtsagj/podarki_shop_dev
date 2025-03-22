import {SET_FILTER_DELETE, SET_FILTER, SET_MESSAGES_COUNT} from '../constants';

const homeState = {
  messagesCount: 0
};

const homeStateReducer = (state = homeState, action) => {
  switch (action.type) {
    case SET_MESSAGES_COUNT:
      return {
        ...state,
        messagesCount: action.payload,
      };
    default:
      break;
  }
  return state;
};
export default homeStateReducer;
