import BookmarkCard from "../components/BookmarkCard";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { server } from "../config/server";
import Spinner from "../components/Spinner";

function BookmarksPage() {
	const [bookmarksList, setBookmarksList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(
			`${server}/api/user/${window.sessionStorage.getItem("userId")}/bookmarks`,
			{
				headers: {
					Authorization: `${window.sessionStorage.getItem("accessToken")}`,
				},
			}
		)
			.then((res) => {
				if (!res.ok) throw new Error("Something went wrong");
				return res.json();
			})
			.then((data) => {
				const bookmarks = JSON.parse(data).map((item) => ({
					id: item.id,
					url: item.url,
					title: item.title,
					description: item.summary,
					image: item.screenshot,
					status: item.status,
				}));
				setBookmarksList(bookmarks);
			})
			.catch((e) => console.log(e))
			.finally(() => setLoading(false));
	}, [loading]);

	function search(value) {
		fetch(`${server}/search`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${window.sessionStorage.getItem("accessToken")}`,
			},
			body: JSON.stringify({
				search: value,
				userId: window.sessionStorage.getItem("userId"),
			}),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Something went wrong");
				return res.json();
			})
			.then((data) => {
				const bookmarks = JSON.parse(data).map((item) => ({
					id: item.id,
					url: item.url,
					title: item.title,
					description: item.summary,
					image: item.screenshot,
					score: item.score,
				}));
				setBookmarksList(bookmarks);
			})
			.catch((e) => console.log(e));
	}

	const updateBookmarks = (deleted_id) => {
		// Update bookmarks list after delete
		setBookmarksList(
			bookmarksList.filter((bookmark) => bookmark.id !== deleted_id)
		);
	};

	return (
		<>
			<SearchBar onSearch={search} />
			<div className="flex flex-wrap gap-8 justify-center mt-12">
				<h1 className="text-2xl font-bold mb-4 text-gray-900">
					View Bookmarks
				</h1>
				<SearchBar onSearch={search} />
				{!bookmarksList.length ? "No bookmarks yet" : ""}
			</div>

			<div className="flex flex-wrap gap-5 justify-center">
				{loading && <Spinner className="w-48 text-[#EAD8BE] opacity-80" />}
				{bookmarksList.length
					? bookmarksList.map((bookmark) => (
							<BookmarkCard
								key={bookmark.id}
								data={bookmark}
								notifyParent={updateBookmarks}
							/>
					  ))
					: ""}
			</div>
		</>
	);
}

export default BookmarksPage;
