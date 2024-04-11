import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import { server } from "./config/server";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HomePage from "./pages/HomePage";
import BookmarksPage from "./pages/BookmarksPage";
import AddBookmarkPage from "./pages/AddBookmarkPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [photo, setPhoto] = useState("");
	const [firstName, setFirstName] = useState("");

	useEffect(() => {
		const accessToken = window.sessionStorage.getItem("accessToken");
		if (accessToken) {
			fetch(`${server}/auth/session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `${accessToken}`,
				},
				body: JSON.stringify({
					userId: window.sessionStorage.getItem("userId"),
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data?.valid) {
						setLoggedIn(true);
						setPhoto(data.photo);
						setFirstName(data.firstName);
						// access token may have changed
						window.sessionStorage.setItem("accessToken", data.accessToken);
					} else {
						window.sessionStorage.removeItem("accessToken");
						window.sessionStorage.removeItem("userId");
					}
				});
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<UserContext.Provider
				value={[
					loggedIn,
					setLoggedIn,
					photo,
					setPhoto,
					firstName,
					setFirstName,
				]}
			>
				<div className="flex flex-col min-h-screen justify-between">
					<Header />
					<main className="px-8 py-6 h-full">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/bookmarks" element={<BookmarksPage />} />
							<Route path="/add" element={<AddBookmarkPage />} />
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</main>
					<Footer />
				</div>
			</UserContext.Provider>
		</>
	);
}

export default App;
