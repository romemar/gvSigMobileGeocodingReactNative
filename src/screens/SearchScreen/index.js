import React, {useState} from 'react'
import Geocoding from '../../componentes/Geocoding'
import {
    SafeAreaView,
    StyleSheet
  } from 'react-native';


const SearchScreen = () => {
    return (
        <SafeAreaView style={Styles.container}>
          <Geocoding/>   
        </SafeAreaView>
      );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
  },
});

export default SearchScreen
