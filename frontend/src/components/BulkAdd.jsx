import { Button, Label, FileInput, Flowbite } from 'flowbite-react'

const customTheme = {
	button: {
		color: {
			primary: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
		}
	}
}

function BulkAdd() {
  return (
    <>
      <div id='fileUpload' className="flex flex-col">
				<div className="mb-2">
					<Label htmlFor='file' value='Upload file' />
				</div>
				<FileInput id='file' name='file'
					helperText='Upload .csv or .md files to upload bookmarks' />
				<Flowbite theme={{ theme:customTheme }}>
					<Button className='mt-6' type='submit' 
						color='primary'>Upload file</Button>
				</Flowbite>
			</div>
    </>
  )
}

export default BulkAdd