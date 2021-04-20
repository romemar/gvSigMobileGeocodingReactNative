import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    autocompleteContainer: {
      zIndex: 1,
    },
    searchResultsContainer: {
      width: 340,
      //height: 200,
      backgroundColor: '#fff',
      position: 'absolute',
      top: 50,
      zIndex: 2
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
    searchBox: {
      width: 340,
      height: 50,
      fontSize: 18,
      borderRadius: 8,
      borderColor: '#aaa',
      color: '#000',
      backgroundColor: '#fff',
      borderWidth: 1.5,
      paddingLeft: 15,
    },
    container: {
      flex: 1,
      backgroundColor: 'lightblue',
      alignItems: 'center',
    },
  });

  export default styles; 