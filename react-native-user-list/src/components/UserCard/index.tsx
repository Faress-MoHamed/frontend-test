import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TransformedUser } from "../../types/user";

interface UserCardProps {
	user: TransformedUser;
	onPress?: (user: TransformedUser) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
	return (
		<TouchableOpacity style={styles.card} onPress={() => onPress?.(user)}>
			<View style={styles.header}>
				<Text style={styles.name}>{user.name}</Text>
				<Text style={styles.username}>@{user.username}</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.email}>{user.email}</Text>
				<Text style={styles.address}>{user.fullAddress}</Text>
			</View>

			<View style={styles.footer}>
				<Text style={styles.phone}>{user.phone}</Text>
				<Text style={styles.website}>{user.website}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		marginHorizontal: 16,
		marginVertical: 8,
		padding: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	name: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		flex: 1,
	},
	username: {
		fontSize: 14,
		color: "#666",
		fontStyle: "italic",
	},
	content: {
		marginBottom: 12,
	},
	email: {
		fontSize: 14,
		color: "#007AFF",
		marginBottom: 4,
	},
	address: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	phone: {
		fontSize: 12,
		color: "#999",
	},
	website: {
		fontSize: 12,
		color: "#999",
	},
});

export default UserCard;
