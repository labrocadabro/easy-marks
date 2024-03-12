import { Tabs } from 'flowbite-react'
import { HiDocumentAdd, HiLink } from 'react-icons/hi'
import BulkAdd from '../components/BulkAdd'
import SingleAdd from '../components/SingleAdd'

function AddBookmarkPage() {
	return (
		<>
			<div className="flex flex-col mx-auto max-w-2xl">
				<h1 className="text-2xl font-bold mb-4 text-emerald-600 text-center">Add Bookmarks</h1>

				<Tabs style='fullWidth'>
					<Tabs.Item active title='Add URL' icon={HiLink} color='primary'>
						<SingleAdd />
					</Tabs.Item>
					<Tabs.Item title='Add File' icon={HiDocumentAdd}>
						<BulkAdd />
					</Tabs.Item>
				</Tabs>
			</div>
		</>
	);
}

export default AddBookmarkPage;
