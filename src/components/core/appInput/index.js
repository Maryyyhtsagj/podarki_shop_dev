import React from 'react';
import {styles} from './styles';
import {TextInput} from 'react-native';
import {Colors, globalStyles} from '../../../constants';

export function AppInput({
  placeholder,
  style,
  onChangeText,
  secureTextEntry,
  numberOfLines,
  maxLength,
  editable,
  multiline,
  keyboardType,
  defaultValue,
  autoFocus,
  value,
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={Colors.gray}
      style={[
        globalStyles.weightLight,
        globalStyles.titleTextSmall,
        styles.input,
        {...style},
      ]}
      autoFocus={autoFocus}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      editable={editable}
      multiline={multiline}
      keyboardType={keyboardType}
      defaultValue={defaultValue}
      value={value}
    />
  );
}
