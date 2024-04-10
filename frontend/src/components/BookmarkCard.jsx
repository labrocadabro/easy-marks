import { Card, Button, Flowbite } from 'flowbite-react';
import { HiTrash } from "react-icons/hi";

// Custom theme to style delete button
const customTheme = {
	button: {
		color: {
			primary:
				"bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
		},
	},
};

function BookmarkCard( { data } ) {

	const handleClick = (e) => {
		console.log("Bookmark with id " + e.target.id + " was clicked")
	}

  return (
		<Card 
		className="max-w-sm space-x-1 space-y-1"
		imgAlt="Meaningful alt text for the image"
		imgSrc={data.image}

		>
			<a href={data.url} target='_blank'>
				<h5 className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">
					{data.title}
				</h5>
				<p className="font-normal text-gray-700 dark:text-gray-400">
					{data.description.slice(0,200) + "..."}
				</p>
			</a>
			<Flowbite theme={{ theme: customTheme }}>
				<Button color="primary" id={data.id} onClick={handleClick}>
					<HiTrash className="h-5 w-5" />
				</Button>
			</Flowbite>
		</Card>
  );
}


export default BookmarkCard;
