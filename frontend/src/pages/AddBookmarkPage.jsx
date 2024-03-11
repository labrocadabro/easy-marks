import { useState } from 'react'
import { ToggleSwitch } from 'flowbite-react'
import BulkAdd from '../components/BulkAdd'
import SingleAdd from '../components/SingleAdd'

function AddBookmarkPage() {
	const [bulkAdd, setBulkAdd] = useState(false);

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Add Bookmarks</h1>

			<div className="mb-2 mt-4 block">
				<ToggleSwitch id='toggle' label='Bulk Add'
					checked={bulkAdd}
					onChange={() => setBulkAdd(!bulkAdd)} />
			</div>

			{bulkAdd ? <BulkAdd /> : <SingleAdd />}

		</>
	);
}

export default AddBookmarkPage;
