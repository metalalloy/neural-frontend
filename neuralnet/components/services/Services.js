import { View, FlatList, Text, TouchableOpacity } from "react-native"; 

import styles from "./style";


function SeriviceRow({routeId, timings, dir, setRoute}) {
    return (
        <TouchableOpacity onPress={() => {setRoute(routeId)}}>
            <View style={styles.row}>
                <View style={styles.routeIdContainer}>
                    <Text style={styles.routeId}>{routeId}</Text>    
                    <Text style={styles.routeDir}>{dir}</Text>
                </View>    
                {timings.map((timing, i) => <Text key={i} style={styles.routeTiming}>{timing}</Text>)}
            </View>
        </TouchableOpacity>
    )
}

export default function Services({routes, setRoute}) {
    return (
        <View style={styles.container}> 
            <FlatList
                data={routes}
                renderItem={({item, i}) => <SeriviceRow key={i} routeId={item.routeId} timings={item.routeTimings} dir={item.routeDir} setRoute={setRoute}/>}
            />
        </View>
    )
}