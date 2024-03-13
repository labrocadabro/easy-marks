import { Card } from 'flowbite-react';

function BookmarkCard() {
  return (
	<a href='https://www.google.com/' target='_blank'>
		<Card
		className="max-w-sm"
		imgAlt="Meaningful alt text for the image"
		imgSrc="google.png"
		>
		<h5 className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">
			Google
		</h5>
		<p className="font-normal text-gray-700 dark:text-gray-400">
			That's where you find shit!
		</p>
		</Card>
	</a>
  );
}


export default BookmarkCard;
