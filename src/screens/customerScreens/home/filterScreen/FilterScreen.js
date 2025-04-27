import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import {
  AppButton,
  FilterData,
  FilterForm,
  BackButton,
} from '../../../../components';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import closeIcon from '../../../../assets/images/closeIcon.png';
import {
  CategoryName,
  globalStyles,
  HomeScreenName,
} from '../../../../constants';
import axiosInstance from '../../../../networking/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';

export const FilterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const filterStore = useSelector((st) => st.filter);
  const user = useSelector((st) => st.customer);

  const [sort, setSort] = useState([
    { id: 2, name: 'По дате публикации убыв', check: false, key: 'newFirst' },
    { id: 3, name: 'По дате публикации возр', check: false, key: 'oldFirst' },
    { id: 4, name: 'По убыванию цены', check: false, key: 'priceDesc' },
    { id: 5, name: 'По возрастанию цены', check: false, key: 'priceAsc' },
    { id: 6, name: 'По Кол-ву меньш', check: false, key: 'countAsc' },
    { id: 7, name: 'По кол.ву больш', check: false, key: 'countDesc' },
  ]);
  const [subCategory, setSubCategory] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    if (Object.keys(filterStore).length) {
      const updatedSort = sort.map((item) => ({
        ...item,
        check: item.key === filterStore.sort,
      }));
      setSort(updatedSort);

      if (filterStore.category_id) {
        checkSubCategory({
          _id: filterStore.category_id,
          title: filterStore.category_name,
        }).then((r) => {
          const updatedSubCategories = r.map((sub) => ({
            ...sub,
            check: filterStore.sub_id.includes(sub._id),
          }));
          setSubCategory(updatedSubCategories);
        });
      }
    }
  }, [filterStore]);

  const checkSubCategory = async (item) => {
    try {
      const response = await axiosInstance.get(
          `/sub-categories?seller_id=${user._id}`,
          { params: { category_id: item._id } }
      );
      const data = response.data.subcategories.map((sub) => ({
        ...sub,
        check: false,
      }));
      setCategory(item);
      setSubCategory(data);
      return data;
    } catch (e) {
      setCategory(item);
      console.log(e);
    }
  };

  const checkFilterSort = (index) => {
    const updatedSort = sort.map((item, i) => ({
      ...item,
      check: i === index,
    }));
    setSort(updatedSort);
  };

  const checkFilterSub = (index) => {
    const updatedSubCategory = [...subCategory];
    updatedSubCategory[index].check = !updatedSubCategory[index].check;
    setSubCategory(updatedSubCategory);
  };

  const filter = () => {
    let subcategoryText = '';
    let sortText = '';
    const sub_id = [];

    subCategory.forEach((data, index) => {
      if (data.check) {
        subcategoryText += index === 0 ? data._id : `,${data._id}`;
        sub_id.push(data._id);
      }
    });

    const selectedSort = sort.find((data) => data.check);
    if (selectedSort) {
      sortText = selectedSort.key;
    }

    const data = {
      category_id: category._id || '',
      category_name: category.title || '',
      subcategory: subcategoryText,
      sort: sortText,
      sub_id,
    };

    dispatch({ type: 'SET_FILTER', payload: data });
    navigation.navigate(HomeScreenName);
  };

  const handleRemoveCategory = () => {
    setCategory({});
    setSubCategory([]);
  };

  return (
      <View style={styles.container}>
        <View>
          <View style={styles.headerContainer}>
            <BackButton
                navigation={navigation}
                text={'Фильтры'}
                deleteAll={() => {
                  dispatch({ type: 'SET_FILTER_DELETE' });
                  setSort(sort.map((item) => ({ ...item, check: false })));
                  setCategory({});
                  setSubCategory([]);
                  navigation.navigate(HomeScreenName);
                }}
            />
          </View>
          <View style={styles.containerCategory}>
            <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.textAlignLeft,
                  styles.titleCategory,
                  globalStyles.weightBold,
                  globalStyles.titleTextSmall,
                ]}
            >
              Сортировка
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
              {sort.map((item, index) => (
                  <FilterForm
                      check={checkFilterSort}
                      item={item}
                      index={index}
                      key={index}
                  />
              ))}
            </ScrollView>
          </View>
          <View style={styles.containerCategory}>
            <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.textAlignLeft,
                  styles.titleCategory,
                  globalStyles.weightBold,
                  globalStyles.titleTextSmall,
                ]}
            >
              Выберите категорию
            </Text>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(CategoryName, { checkSubCategory })
                }
            >
              <View style={styles.category}>
                <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.titleTextSmall,
                      globalStyles.weightLight,
                    ]}
                >
                  {category.title || 'Выберите категорию'}
                </Text>
                {category.title && (
                    <TouchableOpacity onPress={handleRemoveCategory}>
                      <Image source={closeIcon} style={styles.closeIcon} />
                    </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.containerCategory}>
            <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.textAlignLeft,
                  styles.titleCategory,
                  globalStyles.weightBold,
                  globalStyles.titleTextSmall,
                ]}
            >
              Подкатегория
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {subCategory.map((item, index) => (
                  <FilterForm
                      check={checkFilterSub}
                      item={item}
                      index={index}
                      key={index}
                  />
              ))}
            </ScrollView>
          </View>
        </View>
        <View>
          <AppButton
              text={'Применить'}
              stylesContainer={styles.containerBtn}
              onPress={filter}
          />
        </View>
      </View>
  );
};
