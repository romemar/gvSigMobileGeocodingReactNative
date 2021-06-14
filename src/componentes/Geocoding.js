import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  StyleSheet,
  Animated,
} from 'react-native';

const Geocoding = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [gvSigUrl, setGvSigUrl] = useState('http://10.0.2.2/gvsigonline/'); // http://10.0.2.2/ --- localhost del emulador android---
  const [proveedores, setProveedores] = useState([]);
  const [options, setOptions] = useState({});
  //---- const animated
  const [inputLength, setInputLength] = useState(new Animated.Value(0));
  const [iconSearchPosition, setIconSearchPosition] = useState(
    new Animated.Value(0),
  );
  const [opacity, setOpacity] = useState(
    new Animated.Value(0),
  );
  const [geocodingOn, setGeocodingOn]= useState(false)

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const onPressButtonSearch = () => {
    if(!geocodingOn){
      Animated.parallel([
        Animated.timing(inputLength, {
          toValue: 320,
          duration: 400,
          useNativeDriver: false 
        }),
        Animated.timing(iconSearchPosition, {
          toValue: 330,
          duration: 250,
          useNativeDriver: false
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false
        })
      ]).start();
    }
    if(geocodingOn){
      Animated.parallel([
        Animated.timing(inputLength, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false
        }),
        Animated.timing(iconSearchPosition, {
          toValue: 10,
          duration: 400,
          useNativeDriver: false
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false
        })
      ]).start();
      setOptions({})
    }
    setGeocodingOn(!geocodingOn)
    setSearchKeyword('')
  };

  

  //----------función con la llamada a find_candidate

  const geocode = async suggest => {
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

    return await fetch(gvSigUrl + '/geocoding/find_candidate/', {
      method: 'POST',
      headers: {
        //"Content-Type": "application/json"
        'Content-Type': 'application/x-www-form-urlencoded',
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

  //-----------función con la llamada a search_candidates y get_providers_activated

  const lookup = async text => {
    const candidatos = [];
    setSearchKeyword(text);
    console.log(gvSigUrl + '/geocoding/search_candidates/?limit=10&q=' + text);

    if (text.length < 3) {
      setIsShowingResults(false);
      setOptions({});
    } // (cuando ya has hecho una búsqueda previa) que no aparezcan los resultados cuando el texto sea menor que 3 letras

    if (text.length >= 3) {
      let response = await fetch(
        gvSigUrl + '/geocoding/search_candidates/?limit=10&q=' + text,
      );

      let json = await response.json();
      console.log(json);
      let results = json.suggestions;
      setSearchResults(results);
      setIsShowingResults(true);

      if (results.length > 0) {
        //llamada a la API para recoger los proveedores activos
        let response = await fetch(
          gvSigUrl + '/geocoding/get_providers_activated/',
        );
        let json = await response.json();
        console.log('Proveedores' + JSON.stringify(json));
        let provee = json.types;

        //recogemos para cada proveedor sus candidatos de búsqueda
        provee.map(prov => {
          const arrayOptions = [];
          results.map(suggest => {
            if (suggest.category === prov) {
              arrayOptions.push(suggest);
            }
          });
          candidatos.push({
            label: prov,
            options: arrayOptions,
          });
        });
      }
      console.log(candidatos);
      setOptions(candidatos);
    }
  };

  //------- funciones renderizado de candidatos ------
  const renderTitle = title => {
    return <Text style={Styles.categoryLabel}>{title}</Text>;
  };

  const myRenderItem = item => {
    return (
      <TouchableOpacity
        key={item.id}
        style={Styles.resultItem}
        onPress={() => {
          geocode(item);
          setIsShowingResults(false);
          setSearchKeyword(item.address);
        }}>
        <Text>{item.address}</Text>
      </TouchableOpacity>
    );
  };

  const myRender = options => {
    console.log(options);
    const candi = options.item.options;
    console.log(candi);
    return (
      <View>
        {renderTitle(options.item.label)}

        {candi.map(item => {
          return myRenderItem(item);
        })}
      </View>
    );
  };
  //-------

  return (
    <View style={Styles.searchContainer}>

      {isShowingResults && (
          <FlatList
            data={options}
            renderItem={myRender}
            keyExtractor={item => item.id}
            style={Styles.searchResultsContainer}
          />
        )}
        
        <Animated.View style={[Styles.autocompleteContainer,  {
            width: inputLength,
            position: 'absolute',
            left: 16,
            alignSelf: 'center',
            opacity: opacity,
          }
        ]}>
          <TextInput
            placeholder="Search for an address"
            returnKeyType="search"
            style={Styles.searchBox}
            placeholderTextColor="#000"
            onChangeText={text => lookup(text)}
            value={searchKeyword}
          />
        </Animated.View>
      <AnimatedTouchable
        style={[Styles.iconSearch, {left: iconSearchPosition}]}
        onPress={() => onPressButtonSearch()}>
        <Icon name="search" color="#900" size={23} />
      </AnimatedTouchable>
    </View>
  );
};

const Styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: 50,
  },
  iconSearch: {
    position:'absolute',
    marginHorizontal: 12,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor:'white',
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25,
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    width:40,
    height:40,
    paddingLeft:10

  },
  autocompleteContainer: {
    zIndex: 1,
  },
  searchResultsContainer: {
    width: 320,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 40,
    zIndex: 2,
    marginHorizontal:15,
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 15,
  },
  categoryLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    height: 25,
    paddingLeft: 15,
    backgroundColor: '#5AF8EE',
    alignItems: 'center',
  },
  searchBox: {
    height: 40,
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#aaa',
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    paddingLeft: 15,
  },
});

export default Geocoding;
