import { Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HomePage from "./pages/HomePage";
import BookmarksPage from "./pages/BookmarksPage";
import AddBookmarkPage from "./pages/AddBookmarkPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	return (
		<>
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
		</>
	);
}

export default App;
