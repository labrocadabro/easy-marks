// disabling the prop types errors for now. ideally we should just use typescript
/* eslint-disable react/prop-types */

import { HiTrash } from "react-icons/hi";
import { server } from "../config/server";
import Spinner from "./Spinner";

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

	return data.status === "pending" ? (
		<div className="relative">
			<Spinner className="absolute top-[9%] left-1/4 w-48 text-[#6B4944] z-10" />
			<div className="max-w-sm opacity-40 bg-[#EAD8BE]  aspect-[0.75] p-5 rounded-md bookmark-card">
				<img src="public/blank.png" alt={data.url} className="rounded-md" />
				<p className="text-center mt-4">{data.url}</p>
			</div>
		</div>
	) : (
		<div className="max-w-sm aspect-[0.7] bg-[#EAD8BE] p-5 rounded-md bookmark-card relative">
			<a href={data.url} target="_blank">
				<img src={data.image} alt={data.title} className="rounded-md" />
				<h5 className="text-xl font-bold tracking-tight mt-4 mb-2">
					{data.title.length > 55
						? data.title.slice(0, 55) + "..."
						: data.title}
				</h5>
			</a>
			<p>
				{data.description.length > 220
					? data.description.slice(0, 220) + "..."
					: data.description}
			</p>
			<button
				color="primary"
				id={data.id}
				onClick={handleClick}
				className="w-11/12 absolute bg-emerald-600 rounded-md py-2 px-4 bottom-5 flex justify-center text-white"
			>
				<HiTrash className="h-5 w-5" />
			</button>
		</div>
	);
}

export default BookmarkCard;
