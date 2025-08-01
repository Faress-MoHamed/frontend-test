import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingSpinnerProps {
	size?: "small" | "large";
	color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "large",
	color = "#007AFF",
}) => {
	return (
		<View style={styles.container}>
			<ActivityIndicator size={size} color={color} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
});

export default LoadingSpinner;
