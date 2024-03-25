import BookmarkCard from "../components/BookmarkCard";
import { useState } from "react"
import SearchBar from "../components/SearchBar";
import data from "../data/bookmarks.json"


function BookmarksPage() {
	const [bookmarksList, setBookmarksList] = useState(data)
	const [searchState, setSearchState] = useState(null)

	const handleSearchStateChange = (value) => {
		console.log("A search was submitted: " + value)
		setSearchState(value)
	}

	let bookmarkCardsList = []

	for (const i of bookmarksList) {
		bookmarkCardsList.push(<BookmarkCard key={i.key} data={i} />)
	}

	return (
		<>

			<h1 className="text-2xl font-bold mb-4 text-center">View Bookmarks</h1>
			<SearchBar onSearch={handleSearchStateChange} />
			<div className="h-56 grid grid-cols-4 gap-5 content-start">
				{bookmarkCardsList}	
			</div>


		</>
	);
}

export default BookmarksPage;
