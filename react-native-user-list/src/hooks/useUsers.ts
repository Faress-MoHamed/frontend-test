import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

export const useUsers = (page: number = 1, limit: number = 5) => {
	return useQuery({
		queryKey: ["users", page, limit],
		queryFn: () => userService.fetchUsers(page, limit),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
		retryDelay: 1000,
	});
};

export const useInfiniteUsers = (limit: number = 5) => {
	return useInfiniteQuery({
		queryKey: ["users", "infinite", limit],
		queryFn: ({ pageParam = 1 }) => userService.fetchUsers(pageParam, limit),
		getNextPageParam: (lastPage) => {
			// Return the next page number if there are more pages, otherwise undefined
			return lastPage.hasMore ? lastPage.page + 1 : undefined;
		},
		initialPageParam: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
		retryDelay: 1000,
	});
};

export const useAllUsers = () => {
	return useQuery({
		queryKey: ["users", "all"],
		queryFn: () => userService.fetchAllUsers(),
		staleTime: 5 * 60 * 1000,
		retry: 2,
		retryDelay: 1000,
	});
};
