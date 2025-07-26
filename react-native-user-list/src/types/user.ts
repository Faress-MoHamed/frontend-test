export interface Address {
	street: string;
	suite: string;
	city: string;
	zipcode: string;
	geo: {
		lat: string;
		lng: string;
	};
}

export interface Company {
	name: string;
	catchPhrase: string;
	bs: string;
}

export interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	address: Address;
	phone: string;
	website: string;
	company: Company;
}

export interface TransformedUser extends User {
	fullAddress: string;
}

export interface UserListState {
	searchQuery: string;
	currentPage: number;
	allUsers: TransformedUser[];
}

export interface PaginatedUsersResponse {
	users: TransformedUser[];
	page: number;
	hasMore: boolean;
}
