import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ActivityIndicator,
} from "react-native";

interface LoadMoreButtonProps {
	onPress: () => void;
	loading?: boolean;
	disabled?: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
	onPress,
	loading = false,
	disabled = false,
}) => {
	return (
		<TouchableOpacity
			style={[styles.button, disabled && styles.disabled]}
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator color="#fff" />
			) : (
				<Text style={styles.text}>Load More</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#007AFF",
		marginHorizontal: 16,
		marginVertical: 16,
		paddingVertical: 16,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 50,
	},
	disabled: {
		backgroundColor: "#ccc",
	},
	text: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});

export default LoadMoreButton;
