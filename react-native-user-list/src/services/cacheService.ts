// services/cacheService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "users_cache_";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

class CacheService {
	async getCachedData(key: string): Promise<any | null> {
		try {
			const cached = await AsyncStorage.getItem(CACHE_PREFIX + key);
			if (cached) {
				const { data, timestamp } = JSON.parse(cached);
				if (Date.now() - timestamp < CACHE_EXPIRY) {
					return data;
				}
				// Remove expired cache
				await AsyncStorage.removeItem(CACHE_PREFIX + key);
			}
		} catch (error) {
			console.log("Cache read error:", error);
		}
		return null;
	}

	async setCachedData(key: string, data: any): Promise<void> {
		try {
			const cacheData = {
				data,
				timestamp: Date.now(),
			};
			await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
		} catch (error) {
			console.log("Cache write error:", error);
		}
	}

	async clearCache(): Promise<void> {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
			await AsyncStorage.multiRemove(cacheKeys);
		} catch (error) {
			console.log("Cache clear error:", error);
		}
	}
}

export const cacheService = new CacheService();
