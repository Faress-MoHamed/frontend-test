// components/UserListContainer.tsx
import React, { useMemo } from "react";

import UserListView from "../UserListView";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useInfiniteUsers } from "@/hooks/useUsers";
import { setSearchQuery } from "@/redux/userSlice";
import type { TransformedUser } from "@/types/user";

const UserListContainer: React.FC = () => {
	const dispatch = useAppDispatch();
	const { searchQuery } = useAppSelector((state) => state.user);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		refetch,
	} = useInfiniteUsers(5);

	const allUsers = useMemo(() => {
		return data?.pages.flatMap((page) => page.users) || [];
	}, [data]);

	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return allUsers;
		return allUsers.filter((user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [allUsers, searchQuery]);

	const handleSearch = (query: string) => {
		dispatch(setSearchQuery(query));
	};

	const handleUserPress = (user: TransformedUser) => {
		console.log("User pressed:", user.name);
	};

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	return (
		<UserListView
			users={filteredUsers}
			isLoading={isLoading}
			error={error}
			searchQuery={searchQuery}
			hasNextPage={hasNextPage}
			isFetchingNextPage={isFetchingNextPage}
			onSearch={handleSearch}
			onUserPress={handleUserPress}
			onLoadMore={handleLoadMore}
			onRetry={refetch}
		/>
	);
};

export default UserListContainer;
