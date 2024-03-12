import { Tabs} from 'flowbite-react'
import { HiDocumentAdd, HiOutlineClipboardList } from 'react-icons/hi'
import BulkAdd from '../components/BulkAdd'
import SingleAdd from '../components/SingleAdd'

function AddBookmarkPage() {
	return (
		<>
			<h1 className="text-2xl font-bold mb-4 text-emerald-600">Add Bookmarks</h1>

			<Tabs style='default'>
				<Tabs.Item active title='Add URL'
					icon={HiDocumentAdd}>
					<SingleAdd />
				</Tabs.Item>
				<Tabs.Item title='Bulk Add'
					icon={HiOutlineClipboardList}>
					<BulkAdd />
				</Tabs.Item>
			</Tabs>
		</>
	);
}

export default AddBookmarkPage;
