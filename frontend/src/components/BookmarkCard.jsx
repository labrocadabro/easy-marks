import { Card, Button, Flowbite } from "flowbite-react";
import { HiTrash } from "react-icons/hi";
import { server } from "../config/server";

// Custom theme to style delete button
const customTheme = {
	button: {
		color: {
			primary:
				"bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
		},
	},
};

function BookmarkCard({ data, notifyParent }) {
	const handleClick = (e) => {
		const id = e.currentTarget.id;

		fetch(`${server}/api/bookmark`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${window.sessionStorage.getItem("accessToken")}`,
			},
			body: JSON.stringify({
				id: id,
				userId: window.sessionStorage.getItem("userId"),
			}),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Something went wrong");
				notifyParent(id);
			})
			.catch((e) => console.log(e));
	};

	return (
		<div className="max-w-sm bg-[#EAD8BE] p-5 rounded-md bookmark-card">
			<a href={data.url} target="_blank">
				<img src={data.image} alt={data.title} className="rounded-md" />
				<h5 className="text-xl font-bold tracking-tight mt-4 mb-2">
					{data.title}
				</h5>
			</a>
			<p className="p-0 mb-3">{data.description.slice(0, 225) + "..."}</p>
			<Flowbite theme={{ theme: customTheme }}>
				<Button
					color="primary"
					id={data.id}
					onClick={handleClick}
					className="w-full"
				>
					<HiTrash className="h-5 w-5" />
				</Button>
			</Flowbite>
		</div>
	);
}

export default BookmarkCard;
