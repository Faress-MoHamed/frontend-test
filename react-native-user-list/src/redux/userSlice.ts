import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserListState } from "../types/user";

const initialState: UserListState = {
	searchQuery: "",
	currentPage: 1,
	allUsers: [],
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		},
		setCurrentPage: (state, action: PayloadAction<number>) => {
			state.currentPage = action.payload;
		},
		resetFilters: (state) => {
			state.searchQuery = "";
			state.currentPage = 1;
		},
	},
});

export const { setSearchQuery, setCurrentPage, resetFilters } =
	userSlice.actions;
export default userSlice.reducer;
