import React, {useState} from 'react';
import SearchScreenStyles from '../../styles/SearchScreenStyles';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';

const Geocoding = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [gvSigUrl, setGvSigUrl] = useState('https://localhost/gvsigonline');

  const geocode = suggest => {
    console.log(' geocode de ' + JSON.stringify(suggest));
    // TODO: Aquí tenemos que pillar el suggest.raw y
    // obtener el idcalle, id, etc para buscar
    // las coordenadas de una dirección y luego llamar al zoom
    // let csrftoken = Cookies.get("csrftoken");

    // FJP: Esta parte es probable que tenga que cambiarse en gvSIG Online. Jose envía de una forma muy rara
    // la dirección:
    let formBody = [];
    for (let property in suggest) {
      var encodedKey = encodeURIComponent('address[' + property + ']');
      let encodedValue = encodeURIComponent(suggest[property]);
      if (suggest[property] == null) formBody.push(encodedKey + '=');
      else formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    console.log('EL BODY DEL FETCH:  ' + formBody);

    return fetch(gvSigUrl + '/geocoding/find_candidate/', {
      method: 'POST',
      headers: {
        //"Content-Type": "application/json"
        'Content-Type': 'application/x-www-form-urlencoded',
        // "X-CSRFToken": csrftoken
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: formBody, // body data type must match "Content-Type" header
    })
      .then(response => response.json())
      .then(json => {
        console.log('find_candidate: ' + JSON.stringify(json));
        let encontrados = json.address;
        var lat = '\nlat: ' + encontrados.lat;
        var lon = '\nlng: ' + encontrados.lng;
        console.log('Coordenadas ->' + lat + ' ' + lon);
        Alert.alert('Geocoding', 'Hacer zoom en: ' + lat + lon, [
          {
            text: 'OK',
            style: 'OK',
          },
        ]);
      })
      .catch(err => console.error(err.message));
  };

  const lookup = async text => {
    setSearchKeyword(text);
    let response = await fetch(
      gvSigUrl + '/geocoding/search_candidates/?limit=10&q=' + text,
    );
    let json = await response.json();
    console.log(json);

    setSearchResults(json.suggestions);
    setIsShowingResults(true);
  };

  const myRenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={SearchScreenStyles.resultItem}
        onPress={() => {
          geocode(item);
          setIsShowingResults(false);
          setSearchKeyword(item.address);
        }}>
        <Text>{item.address}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={SearchScreenStyles.container}>
      {isShowingResults && (
        <FlatList
          data={searchResults}
          renderItem={myRenderItem}
          keyExtractor={item => item.id}
          style={SearchScreenStyles.searchResultsContainer}
        />
      )}

      <View style={SearchScreenStyles.autocompleteContainer}>
        <TextInput
          placeholder="Search for an address"
          returnKeyType="search"
          style={SearchScreenStyles.searchBox}
          placeholderTextColor="#000"
          onChangeText={text => lookup(text)}
          value={searchKeyword}
        />
      </View>
    </SafeAreaView>
  );
};

export default Geocoding;