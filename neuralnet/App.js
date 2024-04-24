// App.js file

import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { fetch_stop, fetch_path, fetch_ocr } from "./scripts/api";
import * as ImagePicker from "expo-image-picker";
import Services from "./components/services/Services";
import Map from "./components/map/Map";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{title:"Scanner"}}/>
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;


function HomeScreen({navigation}) {
   // Function to capture an image using the device's camera
   const pickImageCamera = async () => {
    // Request permission to access the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {

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
        navigation.navigate('Details');
        performOCR(result.assets[0]);
        setImage(result.assets[0].uri);
      }
    } else {
      // Permission denied
      alert("Permission to access camera denied");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Pressable style={styles.button} onPress={(pickImageCamera)}>
          <Text style={styles.buttonText}>Use the Camera</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Details')}>
        <Text style={styles.buttonText}>Go to Details</Text>
      </Pressable>
    </SafeAreaView>
  );
}


function DetailsScreen({navigation}) {
  const [stopId, setStopId] = useState();
  const [routes, setRoutes] = useState();
  const [paths, setPaths] = useState();
  const [route, setRoute] = useState();
  const [lon, setLon] = useState();
  const [lat, setLat] = useState();
  const refInterval = useRef();

  // State to hold the selected image
  const [image, setImage] = useState(null);

  // State to hold extracted text
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    if (refInterval) {
      clearInterval(refInterval.current);
    }

    if (stopId == "") return;
    setLoading(true);
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

    refInterval.current = intervalUpdate;

    setLoading(true);
    loadPath();
    setLoading(false);
  
    return () => {
      console.warn('clearning')
      clearInterval(refInterval);
    };
  }, [stopId]);

  // State while getting response from API
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Function to perform OCR on an image
  // and extract text
  const performOCR = async (file) => {
    try {
      setLoading(true);

      const stop_id = await fetch_ocr(file);
      console.warn(stopId);
      if (stop_id == "") return;

      const response = await fetch_stop(stop_id);

      setStopId(stop_id);
      setResponse(response);
      setExtractedText(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = (obj, depth = 0) => {
    return (
      <Text style={styles.subheading}>
        {obj.stop_name} (#{obj.stop_id})
      </Text>
    );
  };

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
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Home</Text>
        </Pressable>
        <Text style={styles.heading}>WMATA Bus Timings Retriever</Text>
        <Text style={styles.subheading}>Neural Networks & Deep Learning</Text>

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
          <ActivityIndicator size="large"/>
        ) : (
          <>
          {response && renderResponse(response)}
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
          </>
        )}
        <StatusBar style="auto" />
        
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
});
