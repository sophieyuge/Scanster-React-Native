import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert,
  TouchableHighlight,
} from 'react-native';
import { WebBrowser, ImagePicker, Permissions, FileSystem} from 'expo';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  state = {
    image: null,
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Welcome',
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: '#fbefcc',
      },
      headerTitleStyle: {
      fontWeight: 'bold',
    },

    }
  }

  componentDidMount() {
    	FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos')
    		.catch(e => {
      			return;// wtv, dir probably exists
      		});
  }

  render() {
    let {image} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.sprintContainer}>

            <View style={styles.highlightContainer}>
              <Text style={styles.highlightText}>We Textify Everything!</Text>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/icon.png')
                  : require('../assets/images/icon.png')
              }
              style={styles.iconImage}
            />
          </View>
          <View style = {styles.alignClickable}><Button 
          title = "Take Photos" 
          onPress = {this._takePhoto}
          />
          <TouchableHighlight onPress = {this._takePhoto}>
          <Image
            source={require('../assets/images/camera.png')} />
          </TouchableHighlight>
          </View>
          <View style = {styles.alignClickable}><Button 
          title = "Camera Roll" 
          onPress={this._pickImage} 
          />
          <TouchableHighlight onPress={this._pickImage}>
          <Image
            source={require('../assets/images/addPhoto.png')} />
          </TouchableHighlight>

          </View>
          
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <View style={[styles.highlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.highlightText}>Click the Buttons to Discover Goodies!</MonoText>
          </View>
        </View>
      </View>
    );
  }

  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        quality: 1.0,
        // only for android
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      console.log(pickerResult);

      this._handleImagePicked(pickerResult);
    }
  };

  _handleImagePicked = async pickerResult => {

    try {
      if (!pickerResult.cancelled) {
        await FileSystem.moveAsync({
        	from: pickerResult.uri,
        	to: `${FileSystem.documentDirectory}photos/Photo_${Date.now()}.jpg`
      	});
      }
    } catch (e) {
      alert('Ooooooops...Something Went Wrong :(');
    } 
  };

}

const styles = StyleSheet.create({
  alignClickable: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingTop: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  iconImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 30,
  },
  sprintContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  highlightText: {
    color: 'rgba(96,100,109, 0.8)',
    fontSize: 14,
  },
  highlightContainer: {
    //backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 10,
  },
  navigationFilename: {
    marginTop: 5,
  }
});
