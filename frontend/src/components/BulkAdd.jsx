import { Button, Label, FileInput } from 'flowbite-react'

function BulkAdd() {
  return (
    <>
      <div id='fileUpload' className="flex flex-col">
				<div className="mb-2">
					<Label htmlFor='file' value='Upload file' />
				</div>
				<FileInput id='file' name='file'
					helperText='Upload .csv or .md files to upload bookmarks' />
				<Button className='mt-6' type='submit' 
					color='green'>Upload file</Button>
			</div>
    </>
  )
}

export default BulkAdd