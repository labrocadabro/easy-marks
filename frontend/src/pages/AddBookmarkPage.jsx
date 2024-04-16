import { Tabs } from 'flowbite-react'
import { HiDocumentAdd, HiLink } from 'react-icons/hi'
import BulkAdd from '../components/BulkAdd'
import SingleAdd from '../components/SingleAdd'

function AddBookmarkPage() {
	return (
		<>

			<div className="grid">
				<div style={{marginBottom: "20px", backgroundColor: "#E8D9BF", maxWidth:"100%"}} className="min-w-fit p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">					
		`			<div className="flex flex-col mx-auto max-w-2xl">
						<h1 className="text-2xl font-bold mb-4 text-center">Add Bookmarks</h1>

						{/* Tabs component to switch between single/bulk add */}
						<Tabs style='fullWidth'>
							<Tabs.Item active title='Add URL' icon={HiLink}>
								<SingleAdd />
							</Tabs.Item>
							<Tabs.Item title='Add File' icon={HiDocumentAdd}>
								<BulkAdd />
							</Tabs.Item>
						</Tabs>
					</div>
				</div>
	
			</div>
		</>
	);
}

export default AddBookmarkPage;
