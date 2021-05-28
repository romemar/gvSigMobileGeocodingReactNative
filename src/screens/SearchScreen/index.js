import React, {useState} from 'react'
import SearchScreenStyles from '../../styles/SearchScreenStyles'
import Geocoding from '../../componentes/Geocoding'
//import  {MapView, Marker} from 'react-native-maps'
//import { UrlTile } from 'react-native-maps';
import {
    SafeAreaView,
  } from 'react-native';


const SearchScreen = () => {
    return (
        <SafeAreaView style={SearchScreenStyles.container}>
          <Geocoding/>
          {/* 
{isShowingResults && (
              <FlatList
                data={searchResults}
                renderItem={myRenderItem}
                keyExtractor={(item) => item.id}
                style={SearchScreenStyles.searchResultsContainer}
              />
            )}
  
          <View style={SearchScreenStyles.autocompleteContainer}>
  
            <TextInput
              placeholder="Search for an address"
              returnKeyType="search"
              style={SearchScreenStyles.searchBox}
              placeholderTextColor="#000"
              onChangeText={(text) => lookup(text)}
              value={searchKeyword}
            />
          </View>
          */

          }
            
        </SafeAreaView>
      );
}

export default SearchScreen
