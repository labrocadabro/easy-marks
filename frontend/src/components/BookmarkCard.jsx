import { Card } from 'flowbite-react';

function BookmarkCard( { data } ) {
  return (
	<a href={data.url} target='_blank'>
		<Card 
		className="max-w-sm space-x-1 space-y-1"
		imgAlt="Meaningful alt text for the image"
		imgSrc={data.image}

		>
		<h5 className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">
			{data.title}
		</h5>
		<p className="font-normal text-gray-700 dark:text-gray-400">
			{data.description.slice(0,200) + "..."}
		</p>
		</Card>
	</a>
  );
}


export default BookmarkCard;
