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
} from 'react-native';
import axios from 'axios';

 const API_ENDPOINT = 'https://countriesnow.space/api/v0.1/countries/capital';
 const HeaderMessage = 'List of countries';
 const ErrorMessage = 'Error on fetching data... Check your network connection!';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.countryName, {color: textColor}]}>{item.country}</Text>
  </TouchableOpacity>
);


const App = () => {

  const [countryDetails, setCountryDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    getCountryDetails();
  }, [])


  /* Get the World Country Details */

  const getCountryDetails  = async () => {
    try {
      const response = await axios.get(API_ENDPOINT);
      const country = response.data.data.map((country) => ({id: Math.random(), country: country.name}));
      setCountryDetails(country);
    }
    catch (err) {
      setError(err);
    }
  }

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
      <FlatList
        data={countryDetails}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
        windowSize={40}
        maxToRenderPerBatch={40}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={70}
        ListEmptyComponent={ 
          <View style={[styles.backgroundView, styles.errorView]}>
            <Text style={[styles.message, styles.errorMessage]}>{ErrorMessage}</Text>
          </View>
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