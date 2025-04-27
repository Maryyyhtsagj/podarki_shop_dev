import React, { useState, useEffect } from 'react';
import { styles } from './styles';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StatusBar,
    Platform,
} from 'react-native';
import {
    BackButton,
    FinancialForm,
} from '../../../../components';
import {
    Colors,
    FinancialFilterName,
    globalStyles,
} from '../../../../constants';
import FilterIcon from '../../../../assets/images/filter.png';
import axiosInstance from '../../../../networking/axiosInstance';
import moment from 'moment';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const FinancialReportScreen = ({ navigation }) => {
    const [finances, setFinances] = useState([]);
    const [financesData, setFinancesData] = useState([]);
    const [allPrice, setAllPrice] = useState(0);

    /** Handles filter changes from the filter screen */
    const onChangeFilter = (item, price) => {
        console.log('Filter applied - item:', item, 'price:', price); // Debugging log
        let data = [...financesData]; // Create a copy of the original data

        // Apply price sorting if specified
        if (price && price.type) {
            if (price.type === 'small') {
                data.sort((a, b) => Number(a.price) - Number(b.price)); // Sort ascending
            } else if (price.type === 'large') {
                data.sort((a, b) => Number(b.price) - Number(a.price)); // Sort descending
            }
        }

        // Apply date filter only if a specific range is selected
        if (item && item.key !== 'all') {
            let filteredItems = [];
            for (let i = 0; i < data.length; i++) {
                let date = moment(data[i].delivery_date, 'YYYY-MM-DD');
                if (!date.isValid()) {
                    console.log('Invalid date format:', data[i].delivery_date);
                    continue;
                }
                let dateNow = moment();
                let duration = dateNow.diff(date, 'days');
                if (duration >= 0 && duration < Number(item.key)) {
                    filteredItems.push(data[i]);
                }
            }
            console.log('Filtered items count:', filteredItems.length);
            setFinances(filteredItems);
        } else {
            // No date filter applied; show all sorted items
            setFinances(data);
        }
    };

    /** Fetches financial data from the API */
    const axiosFunc = async () => {
        try {
            const response = await axiosInstance.get('/finances');
            setFinances(response.data);
            setFinancesData(response.data);
            let total = 0;
            for (let i = 0; i < response.data.length; i++) {
                total += Number(response.data[i].income);
            }
            setAllPrice(total);
        } catch (e) {
            console.log('API error:', e);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        axiosFunc();
    }, []);

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
                    Platform.OS === 'ios' && { paddingTop: getStatusBarHeight(true) + 8 },
                ]}>
                <BackButton navigation={navigation} text={'Финансовый отчет'} />
                <View style={[styles.headerContent]}>
                    <TouchableOpacity
                        style={styles.filterContainer}
                        onPress={() =>
                            navigation.navigate(FinancialFilterName, {
                                onChangeFilter: onChangeFilter,
                            })
                        }>
                        <Text
                            style={[
                                styles.filterTextStyle,
                                globalStyles.titleText,
                                globalStyles.weightLight,
                                globalStyles.titleTextSmall,
                            ]}>
                            Фильтры
                        </Text>
                        <Image source={FilterIcon} style={styles.filterIconStyle} />
                    </TouchableOpacity>
                    <Text style={globalStyles.titleText}>Сумма: {allPrice} р</Text>
                </View>
            </View>
            {finances.length === 0 ? (
                <Text style={globalStyles.titleText}>
                    Для выбранного фильтра ничего не найдено.
                </Text>
            ) : (
                <FlatList
                    data={finances}
                    renderItem={({ item, index }) => (
                        <FinancialForm item={item} key={index} navigation={navigation} />
                    )}
                />
            )}
        </View>
    );
};
