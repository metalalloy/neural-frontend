import { View, ActivityIndicator } from "react-native"; 
import { useEffect, useState } from "react";

import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { fetch_positions } from "../../scripts/api";
import styles from './style'

const bus_icon = require("../../assets/bus-icon.png");

export default function Map({lon, lat, path, route, dir, vars}) {
    const [locs, setLocs] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        const refresh = setInterval(() => {
            const fetch_locs = async () => {
                const _locs = (await fetch_positions(vars, Array(vars.length).fill(dir), lon, lat))[route] ?? [];
                setLocs(_locs);
                setLoading(false);
            }
            fetch_locs();
        }, 3000);

        return () => {
            clearInterval(refresh);
        }
    }, [route, dir])
    return (
        
        <View style={styles.mapContainer}> 
            {!loading ? <MapView 
                style={styles.map} 
                provider={PROVIDER_GOOGLE}
                initialRegion={{longitude: lon, latitude: lat, latitudeDelta: 0.02, longitudeDelta: 0.02}}
            >
                <Marker 
                    coordinate={{longitude: lon, latitude: lat, latitudeDelta: 0.01, longitudeDelta: 0.01}}   
                />
                <Polyline
                    coordinates={path}
                    strokeColor="#e66"
                    strokeWidth={6}
                />
                {locs && locs.map((loc, i) => <Marker key={i} coordinate={loc} image={bus_icon} />)}
            </MapView>
            :
            <ActivityIndicator size="large" />
            }
        </View>
    )
}