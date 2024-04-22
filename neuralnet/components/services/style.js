import { StyleSheet } from "react-native"; 

export default styles = StyleSheet.create({ 
	container: { 
		display: "flex", 
		width: "100%",
		marginBottom: 20
	}, 
	routeId: {
		fontWeight: "bold",
		fontSize: 20,
		width: 80,
		textAlign: "center"
	},
	routeDir: {
		textAlign: "center",
		fontSize: 10
	},
	routeIdContainer: {
		borderWidth: 1,
		marginRight: 10,
		paddingTop: 2,
		paddingBottom: 2
	},
	routeTiming: {
		fontSize: 15,
		marginLeft: 30,
		borderRightWidth: 1,
		borderRightColor: "black"
	},
	row: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		padding: 5
	}
});
