// components/UserListView.tsx
import type { TransformedUser } from "@/types/user";
import React from "react";
import {
	FlatList,
	ListRenderItem,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import ErrorMessage from "../ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";
import LoadMoreButton from "../LoadMoreButton";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";

interface UserListViewProps {
	users: TransformedUser[];
	isLoading: boolean;
	error: any;
	searchQuery: string;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	onSearch: (query: string) => void;
	onUserPress: (user: TransformedUser) => void;
	onLoadMore: () => void;
	onRetry: () => void;
}

const UserListView: React.FC<UserListViewProps> = ({
	users,
	isLoading,
	error,
	searchQuery,
	hasNextPage,
	isFetchingNextPage,
	onSearch,
	onUserPress,
	onLoadMore,
	onRetry,
}) => {
	const renderUser: ListRenderItem<TransformedUser> = ({ item }) => (
		<UserCard user={item} onPress={onUserPress} />
	);

	const renderFooter = () => {
		if (!hasNextPage) return null;

		return (
			<LoadMoreButton
				onPress={onLoadMore}
				loading={isFetchingNextPage}
				disabled={!hasNextPage}
			/>
		);
	};

	const renderEmptyComponent = () => (
		<View style={styles.emptyContainer}>
			<Text style={styles.emptyText}>
				{searchQuery
					? "No users found matching your search."
					: "No users available."}
			</Text>
		</View>
	);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return (
			<ErrorMessage
				message={
					error instanceof Error ? error.message : "Failed to load users"
				}
				onRetry={onRetry}
			/>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Users</Text>
			</View>

			<SearchBar
				value={searchQuery}
				onChangeText={onSearch}
				placeholder="Search users by name..."
			/>

			<FlatList
				data={users}
				renderItem={renderUser}
				keyExtractor={(item) => item.id.toString()}
				ListFooterComponent={renderFooter}
				ListEmptyComponent={renderEmptyComponent}
				showsVerticalScrollIndicator={false}
				removeClippedSubviews={true}
				maxToRenderPerBatch={10}
				windowSize={10}
				initialNumToRender={10}
				getItemLayout={(data, index) => ({
					length: 140,
					offset: 140 * index,
					index,
				})}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 40,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
});

export default UserListView;
