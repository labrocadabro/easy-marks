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
			<div className="flex flex-col mx-auto max-w-2xl p-6 bg-[#EAD8BE] rounded-md w-full md:w-1/2 items-center my-8">
				<SearchBar onSearch={search} className="w-full mb-4" />
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
