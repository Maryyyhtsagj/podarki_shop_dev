import {Colors} from '../../../constants';
import {StyleSheet, Dimensions} from 'react-native';
import {globalHeight, globalWidth} from '../../index';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  chatContainer: {
    paddingRight: globalWidth(31),
    paddingLeft: globalWidth(21),
    borderBottomWidth: 1,
    borderColor: Colors.borderGray,
    paddingVertical: globalWidth(18),
    position: 'relative',
  },
  name: {
    marginBottom: globalHeight(5),
  },
  timeContainer: {
    position: 'absolute',
    right: globalWidth(25),
    top: globalWidth(7),
    zIndex: 10,
  },
  notNumber: {
    fontSize: globalWidth(12),
    fontWeight: '700',
    color: '#213F50',
  },
  notNumberCont: {
    width: globalWidth(20),
    height: globalHeight(23),
    backgroundColor: '#EF52B0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    right: globalWidth(20),
    top: globalHeight(50),
  },
});
