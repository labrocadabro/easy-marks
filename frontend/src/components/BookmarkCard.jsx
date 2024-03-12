function BookmarkCard() {
	return (
		<div className="mt-8 rounded overflow-hidden shadow-md w-full sm:w-4/12">
			<img src="google.png" className="w-full object-cover" />
			<div className="text-gray-600 m-4">
				{/* Title */}
				<h2 className="mb-2">Google</h2>
				{/* Description */}
				<div className="block">That's where you find shit</div>
			</div>
		</div>
	);
}

export default BookmarkCard;
