import {combineReducers, legacy_createStore as createStore} from 'redux';
import userReducer from './customerReducer';
import filterReducer from './filterReducer';
import homeStateReducer from './homeStateReducer';

const store = createStore(
  combineReducers({
    customer: userReducer,
    filter: filterReducer,
    homeState: homeStateReducer,
  }),
);

export default store;
