// services/userService.ts
import axios from "axios";
import { cacheService } from "./cacheService";
import { userTransformer } from "./userTransformer";
import { PaginatedUsersResponse, User, type TransformedUser } from "../types/user";

const BASE_URL = "https://jsonplaceholder.typicode.com";

class UserService {
	async fetchUsers(
		page: number = 1,
		limit: number = 5
	): Promise<PaginatedUsersResponse> {
		const cacheKey = `users_page_${page}_limit_${limit}`;

		// Try cache first
		const cachedData = await cacheService.getCachedData(cacheKey);
		if (cachedData) {
			return cachedData;
		}

		try {
			const response = await axios.get<User[]>(`${BASE_URL}/users`);
			const allUsers = response.data;
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedUsers = allUsers.slice(startIndex, endIndex);

			const transformedUsers = userTransformer.transformUsers(paginatedUsers);

			const result: PaginatedUsersResponse = {
				users: transformedUsers,
				page,
				hasMore: endIndex < allUsers.length,
			};

			// Cache the result
			await cacheService.setCachedData(cacheKey, result);
			return result;
		} catch (error) {
			// Try to return cached data on network error
			const fallbackCache = await cacheService.getCachedData(cacheKey);
			if (fallbackCache) {
				return fallbackCache;
			}
			throw error;
		}
	}

	async fetchAllUsers(): Promise<TransformedUser[]> {
		const cacheKey = "all_users";

		// Try cache first
		const cachedData = await cacheService.getCachedData(cacheKey);
		if (cachedData) {
			return cachedData;
		}

		try {
			const response = await axios.get<User[]>(`${BASE_URL}/users`);
			const transformedUsers = userTransformer.transformUsers(response.data);

			// Cache the result
			await cacheService.setCachedData(cacheKey, transformedUsers);
			return transformedUsers;
		} catch (error) {
			// Try to return cached data on network error
			const fallbackCache = await cacheService.getCachedData(cacheKey);
			if (fallbackCache) {
				return fallbackCache;
			}
			throw error;
		}
	}

	async clearCache(): Promise<void> {
		await cacheService.clearCache();
	}
}

export const userService = new UserService();
