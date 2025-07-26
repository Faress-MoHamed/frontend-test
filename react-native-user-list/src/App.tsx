// App.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import UserListContainer from "./components/UserListContainer";
import { persistor, store } from "./redux/store";
import { queryClient } from "./utils/queryClient";
import LoadingSpinner from "./components/LoadingSpinner";

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate loading={<LoadingSpinner />} persistor={persistor}>
					<UserListContainer />
					<StatusBar style="auto" />
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	);
};

export default App;
