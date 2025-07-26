// services/userTransformer.ts
import { User, TransformedUser } from "../types/user";

class UserTransformer {
	transformUser(user: User): TransformedUser {
		return {
			...user,
			fullAddress: `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`,
		};
	}

	transformUsers(users: User[]): TransformedUser[] {
		return users.map(this.transformUser);
	}
}

export const userTransformer = new UserTransformer();
