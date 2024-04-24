import { StyleSheet } from "react-native"; 

export default styles = StyleSheet.create({ 
	container: { 
		display: "flex", 
		alignContent: "center", 
		alignItems: "center", 
		justifyContent: "space-evenly", 
		backgroundColor: "#ff0", 
		borderWidth: 1,
		height: "100%", 
	}, 
	heading: { 
		fontSize: 28, 
		fontWeight: "bold", 
		marginBottom: 10, 
		color: "red", 
		textAlign: "center", 
	}, 
	heading2: { 
		fontSize: 22, 
		fontWeight: "bold", 
		marginBottom: 10, 
		color: "black", 
		textAlign: "center", 
	}, 
	text1: { 
		fontSize: 16, 
		marginBottom: 10, 
		color: "black", 
		fontWeight: "bold", 
	}, 
	map: {
		flex: 1,
		borderWidth: 1,
		width: "100%"
	},
	mapContainer: {
		width: "100%",
		height: 300,
	}
});
