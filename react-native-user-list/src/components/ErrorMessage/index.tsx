import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ErrorMessageProps {
	message: string;
	onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Oops! Something went wrong</Text>
			<Text style={styles.message}>{message}</Text>
			{onRetry && (
				<TouchableOpacity style={styles.retryButton} onPress={onRetry}>
					<Text style={styles.retryText}>Try Again</Text>
				</TouchableOpacity>
			)}
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
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
		textAlign: "center",
	},
	message: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		marginBottom: 20,
		lineHeight: 20,
	},
	retryButton: {
		backgroundColor: "#007AFF",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});

export default ErrorMessage;
