import { Tabs } from "flowbite-react";
import { HiDocumentAdd, HiLink } from "react-icons/hi";
import BulkAdd from "../components/BulkAdd";
import SingleAdd from "../components/SingleAdd";

function AddBookmarkPage() {
	return (
		<>
			<div className="flex flex-col mx-auto max-w-2xl p-6 bg-[#EAD8BE] rounded-md">
				<h1 className="text-2xl font-bold mb-4 text-center">Add Bookmarks</h1>

				{/* Tabs component to switch between single/bulk add */}
				<Tabs style="fullWidth">
					<Tabs.Item active title="Add URL" icon={HiLink}>
						<SingleAdd />
					</Tabs.Item>
					<Tabs.Item title="Add File" icon={HiDocumentAdd}>
						<BulkAdd />
					</Tabs.Item>
				</Tabs>
			</div>
		</>
	);
}

export default AddBookmarkPage;
