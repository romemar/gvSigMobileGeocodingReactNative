import React, {useState} from 'react'
import SearchScreenStyles from '../../styles/SearchScreenStyles'
import Geocoding from '../../componentes/Geocoding'
import {
    SafeAreaView,
  } from 'react-native';


const SearchScreen = () => {
    return (
        <SafeAreaView style={SearchScreenStyles.container}>
          <Geocoding/>   
        </SafeAreaView>
      );
}

export default SearchScreen
