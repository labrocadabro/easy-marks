import BookmarkCard from "../components/BookmarkCard";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { server } from "../config/server";

function BookmarksPage() {
	const [bookmarksList, setBookmarksList] = useState(null);
	const [searchState, setSearchState] = useState(null);
	const [sendSearch, setSendSearch] = useState(false);

	useEffect(() => {
		if (!searchState) {
			fetch(`${server}/bookmarks`)
				.then((res) => res.json())
				.then((data) => {
					const bookmarks = JSON.parse(data).map((item) => ({
						id: item._id._oid,
						url: item.url,
						title: item.title,
						description: item.summary,
						image: item.screenshot,
					}));
					setBookmarksList(bookmarks);
				})
				.catch((e) => console.log(e));
		} else if (sendSearch) {
			fetch(`${server}/search`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ search: searchState }),
			})
				.then((res) => res.json())
				.then((data) => {
					const bookmarks = JSON.parse(data).map((item) => ({
						id: item._id._oid,
						url: item.url,
						title: item.title,
						description: item.summary,
						image: item.screenshot,
						score: item.score,
					}));
					setBookmarksList(bookmarks);
					console.log("Booksmarks:", bookmarks);
					setSendSearch(false);
				})
				.catch((e) => console.log(e));
		}
	}, [searchState, sendSearch]);

	const handleSearchStateChange = (value) => {
		console.log("A search was submitted: " + value);
		setSearchState(value);
	};

	return (
		<>
			<h1 className="text-2xl font-bold mb-4 text-center">View Bookmarks</h1>
			<SearchBar onSearch={handleSearchStateChange} />
			<div className="h-56 grid grid-cols-4 gap-5 content-start">
				{bookmarksList
					? bookmarksList.map((bookmark) => (
							<BookmarkCard key={bookmark.id} data={bookmark} />
					  ))
					: "No bookmarks yet"}
			</div>
		</>
	);
}

export default BookmarksPage;
