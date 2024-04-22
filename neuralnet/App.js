// App.js file

import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Camera, CameraType } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import { fetch_stop, fetch_path, fetch_positions } from "./scripts/api";
import * as ImagePicker from "expo-image-picker";
import Services from "./components/services/Services";
import { fetch_path, fetch_stop } from "./scripts/api";
import Map from "./components/map/Map";

export default function App() {
  const [stopId, setStopId] = useState();
  const [routes, setRoutes] = useState();
  const [paths, setPaths] = useState();
  const [route, setRoute] = useState();
  const [lon, setLon] = useState();
  const [lat, setLat] = useState();

  // State to hold the selected image
  const [image, setImage] = useState(null);

  // State to hold extracted text
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    const loadPath = async () => {
      const stopInfo = await fetch_stop(stopId);
      const stopLon = stopInfo.stop_lon;
      const stopLat = stopInfo.stop_lat;
      const tempPaths = {};

      for (const [routeId, routeInfo] of Object.entries(stopInfo.stop_routes)) {
        if (routeInfo.dir != "") {
          tempPaths[routeId] = {
            coords: (await fetch_path(routeId, routeInfo.dir)).coords,
            variations: routeInfo.variations,
            dir: routeInfo.dir,
          };
        }
      }
      setPaths(tempPaths);
      setLat(stopLat);
      setLon(stopLon);
    };
    loadPath();

    const intervalUpdate = setInterval(() => {
      const fetchData = async () => {
        const stopInfo = await fetch_stop(stopId);
        const tempRoutes = [];

        for (const [routeId, routeInfo] of Object.entries(
          stopInfo.stop_routes
        )) {
          if (routeInfo.dir != "") {
            tempRoutes.push({
              routeId: routeId,
              routeTimings: routeInfo.times,
              routeDir: routeInfo.dir,
            });
          }
        }
        setRoutes(tempRoutes);
      };
      fetchData();
    }, 5000);

    return () => {
      clearInterval(intervalUpdate);
    };
  }, [stopId]);

  // State while getting response from API
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // State to access the camera
  const [startCamera, setStartCamera] = useState(false);

  // State to show the camera preview
  const [previewVisible, setPreviewVisible] = useState(false);

  // State to obtain photo
  const [capturedImage, setCapturedImage] = useState(null);

  // Function to pick an image from gallery
  const pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      // Perform OCR on the selected image
      performOCR(result.assets[0]);

      // Set the selected image in state
      setImage(result.assets[0].uri);
    }
  };

  // Function to capture an image using the device's camera
  const pickImageCamera = async () => {
    // Request permission to access the camera
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);

      // Permission granted, proceed with launching camera
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        allowsMultipleSelection: false,
      });

      if (!result.cancelled) {
        // Perform OCR on the captured image
        // Set the captured image in state
        performOCR(result.assets[0]);
        setImage(result.assets[0].uri);
      }
    } else {
      // Permission denied
      alert("Permission to access camera denied");
    }
  };

  // Function to perform OCR on an image
  // and extract text
  const performOCR = async (file) => {
    try {
      setLoading(true);
      const response = await fetch_stop(1002864);
      setStopId(1002864);
      setResponse(response);
      setExtractedText(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const renderResponse = (obj, depth = 0) => {
  //     return (
  //         <Text style={styles.subheading}>{obj.stop_name} (#{obj.stop_id})</Text>
  //     )
  // return Object.keys(obj).sort().map((key, index) => {
  //   const value = obj[key];
  //   if (typeof value === 'object' && value !== null) {
  //  return (
  //    <Text key={index} style={[styles.text, { marginLeft: depth * 10 }]}>
  //      {key}:
  //      {renderResponse(value, depth + 1)}
  //    </Text>
  //  );
  //   } else {
  //  return (
  //    <Text key={index} style={[styles.text, { marginLeft: depth * 10 }]}>
  //      {`${key}: ${value}`}
  //    </Text>
  //  );
  //   }
  // });
  // };
  const renderResponse = (obj, depth = 0) => {
    return Object.keys(obj)
      .sort()
      .map((key, index) => {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
          return (
            <Text key={index} style={[styles.text, { marginLeft: depth * 10 }]}>
              {key}:{renderResponse(value, depth + 1)}
            </Text>
          );
        } else {
          return (
            <Text key={index} style={[styles.text, { marginLeft: depth * 10 }]}>
              {`${key}: ${value}`}
            </Text>
          );
        }
      });
  };

  const takePicture = async () => {
    // camera is a reference to the Camera component
    if (!camera) {
      return;
    }
    const photo = await camera.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    pickImageCamera();
  };

  const savePhoto = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        centerContent={true}
      >
        <Text style={styles.heading}>WMATA Bus Timings Retriever</Text>
        <Text style={styles.subheading}>Neural Networks & Deep Learning</Text>
        <Pressable style={styles.button} onPress={pickImageGallery}>
          <Text style={styles.buttonText}>Choose from gallery</Text>
        </Pressable>
        {startCamera ? (
          previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={savePhoto}
              retakePicture={retakePicture}
            />
          ) : (
            <Camera
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r;
              }}
            >
              <View style={styles.cameraView}>
                <View style={styles.cameraBtn1}>
                  <View style={styles.cameraBtn2}>
                    <TouchableOpacity
                      onPress={takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: "#fff",
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )
        ) : (
          <Pressable style={styles.button} onPress={pickImageCamera}>
            <Text style={styles.buttonText}>Use the Camera</Text>
          </Pressable>
        )}
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
              borderWidth: 1,
            }}
          />
        )}
        <Text style={styles.subheading2}>Bus Stop Information:</Text>
        {loading ? (
          <Text style={styles.text}>Loading...</Text>
        ) : (
          response && renderResponse(response)
        )}
        <StatusBar style="auto" />
        <Services routes={routes} setRoute={setRoute} />
        {paths && route && route in paths && lat && lon && (
          <Map
            lon={lon}
            lat={lat}
            path={paths[route].coords}
            route={route}
            dir={paths[route].dir}
            vars={paths[route].variations}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  subheading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#132676", // Black color for subheading
  },
  subheading2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#132676", // Black color for subheading
  },
  button: {
    backgroundColor: "#000000",
    marginVertical: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // White color for text
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: "#132676", // Black color for text
  },
  cameraView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  cameraBtn1: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "space-between",
  },
  cameraBtn2: {
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
  },
});

// returns the pic
const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
  // console.log("sdsfds", photo);
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
