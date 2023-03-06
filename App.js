import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  TextInput,
  RefreshControl
} from 'react-native';
import axios from 'axios';

 const API_ENDPOINT = 'https://countriesnow.space/api/v0.1/countries/capital';
 const HeaderMessage = 'List of countries';
 const ErrorMessage = 'Error on fetching data... Check your network connection!';
 const NoCountryFound = 'No Country found';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.countryName, {color: textColor}]}>{item.country}</Text>
  </TouchableOpacity>
);


const App = () => {

  const [countryMainData, setCountryMainData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchedCountry, setSearchedCountry] = useState([]);
  const [isError, setIsError] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    getCountryMainData();
  }, [])


  /* Get the World Country Main Data */

  const getCountryMainData  = async () => {
    try {
      const response = await axios.get(API_ENDPOINT);
      const country = response.data.data.map((country) => ({id: Math.random(), country: country.name}));
      setRefreshing(false);
      setCountryMainData(country);
      setSearchedCountry(country)
    }
    catch (err) {
      setIsError(true);
    }
  }

  const handleSearch = (text) => {
    if (text) {
      const newData = countryMainData.filter(
        function (item) {
          const itemData = item.country
            ? item.country.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setSearchedCountry(newData);
      setSearch(text);
    } else {
      setSearchedCountry(countryMainData);
      setSearch(text);
    }
  };

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#F5F5F5' : '#dddddd';
    const color = item.id === selectedId ? '#000000' : '#484747';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.backgroundView, styles.headerView, {height: 40}]}>
        <Text style={[styles.message, styles.headerMessage]}>{HeaderMessage}</Text>
      </View>
      <View style={styles.searchView}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          underlineColorAndroid="transparent"
          value={search}
          onChangeText={searchText => handleSearch(searchText)}
          placeholder="Search Here"
          style={{ backgroundColor: '#fff', paddingHorizontal: 10, color: '#000' }}
        />
      </View>
      <FlatList
        data={searchedCountry}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
        windowSize={40}
        maxToRenderPerBatch={40}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={70}
        ListEmptyComponent={
          isError ? 
            <View style={[styles.backgroundView, styles.errorView]}>
              <Text style={[styles.message, styles.errorMessage]}>{ErrorMessage}</Text>
            </View>
           :
          <View style={[styles.backgroundView, styles.noDataView]}>
            <Text style={[styles.message, styles.noDataMessage]}>{NoCountryFound}</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getCountryMainData} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: Platform.OS  === 'android' && 5,
  },
  countryName: {
    fontSize: 20,
    textAlign : 'center',
  },
  headerView: {
    backgroundColor: '#62646b',
  },
  message : { 
    fontSize: 20,
    textAlign : 'center',
    fontWeight: 'bold',
  },
  headerMessage: {
    color: 'white',
  },
  errorView : {
    backgroundColor: '#dddddd',
  },
  errorMessage: {
    color : 'red',
  },
  noDataView : {
    backgroundColor: '#dddddd',
  },
  noDataMessage: {
    color : '#000',
  },
  searchView:{
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    borderColor: '#dddddd',
    borderWidth: 2,
    marginHorizontal: 16,
  },
  backgroundView : {
    // flex: 1,
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;