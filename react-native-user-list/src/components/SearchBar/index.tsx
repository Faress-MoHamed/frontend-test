import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface SearchBarProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
	value,
	onChangeText,
	placeholder = "Search users by name...",
}) => {
	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor="#999"
				clearButtonMode="while-editing"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: "#f8f9fa",
	},
	input: {
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
});

export default SearchBar;
