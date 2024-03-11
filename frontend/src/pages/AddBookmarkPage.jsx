import { useState } from 'react'
import { Button, TextInput, Label, FileInput, ToggleSwitch } from 'flowbite-react'
import { HiLink } from 'react-icons/hi'

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

			<form className="flex max-w-md flex-col gap-4">
				<div>
					<div className='mb-2 block'>
						<Label htmlFor='url' value='URL' />
					</div>
					<TextInput id='url' type='link' name='url'
						placeholder='https://example.com' required rightIcon={HiLink} />
				</div>
				<Button color="green" type='submit'>Add URL</Button>
			</form>

			<div id='fileUpload' className="max-w-md">
				<div className="mb-2 block">
					<Label htmlFor='file' value='Upload file' />
				</div>
				<FileInput id='file' name='file' 
					helperText='Upload a CSV or Markdown file of your bookmarks' />
				<Button className='mb-2 mt-4' color="green" type='submit'>Upload file</Button>
			</div>
		</>
	);
}

export default AddBookmarkPage;
