import React, { useEffect, useState } from "react";
import { Avatar, Button, Icon } from "react-native-elements";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Platform, ToastAndroid } from "react-native";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import WebBrowser from "expo-web-browser";
import { getImages } from "../api/pexels";
import ImageList from "../components/ImageList";
import { Share } from 'react-native'; // Importando Share

const ImageScreen = ({ route }) => {
  const { image } = route.params;
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    const res = await getImages();
    setImages(res.data.photos);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handlePress = async () =>
    await WebBrowser.openBrowserAsync(image.photographer_url);

  const handleShare = () => {
    Share.share({ // Utilizando la función share de Share
      message: image.src.medium,
    })
    .then(result => console.log(result))
    .catch(error => console.log(error));
  };

  const handleDownload = async () => {
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await FileSystem.downloadAsync(image.src.medium, FileSystem.documentDirectory + 'photo.jpg')
          .then(async ({ uri }) => {
            await MediaLibrary.saveToLibraryAsync(uri);
            showDownloadMessage();
          })
          .catch(error => {
            console.error('Error al descargar y guardar la imagen:', error);
          });
      } else {
        console.error('Permisos de acceso a la galería no otorgados');
      }
    } else {
      console.error('La descarga de imágenes solo es compatible con Android');
    }
  };

  const showDownloadMessage = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('¡Imagen descargada!', ToastAndroid.SHORT);
    } else {
    }
  };

  return (
    <View style={styles.headerPhotographer}>
      <Image
        source={{
          uri: image.src.medium,
          height: 350,
          width: "100%",
        }}
      />
      <View
        style={{
          paddingVertical: 18,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Avatar
            rounded
            title={image.photographer
              .split(" ")
              .map((string) => string[0])
              .join("")
              .toUpperCase()}
            containerStyle={{ backgroundColor: image.avg_color }}
          />
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.textPhotographer}>{image.photographer}</Text>
          </TouchableOpacity>
        </View>
  
        <View style={{ flexDirection: 'row' }}>
          <Button
            title="Share"
            buttonStyle={{ backgroundColor: "#229783", marginLeft: 4, marginRight: 15 }}
            onPress={handleShare}
          />
          <Button
          title="Dowload"
            icon={
              <Icon
                name="download"
                type="feather"
                color="white"
                size={20}
              />
            }
            buttonStyle={{ backgroundColor: "#007bff", marginRight: 20}}
            onPress={handleDownload}
          />
        </View>
      </View>

      <View>
        <ImageList photos={images} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerPhotographer: {
    backgroundColor: "#0D0D0D",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
  },
  textPhotographer: {
    fontSize: 18,
    marginStart: 5,
    color: "#7f8c8d",
    fontWeight: "bold",
  },
  cardImageText: {
    color: "#fff",
  },
});

export default ImageScreen;
