import { Button, Label, FileInput } from 'flowbite-react'

function BulkAdd() {
  return (
    <>
      <div id='fileUpload' className="max-w-md">
				<div className="mb-2 block">
					<Label htmlFor='file' value='Upload file' />
				</div>
				<FileInput id='file' name='file' 
					helperText='Upload a CSV or Markdown file of your bookmarks' />
				<Button className='mb-2 mt-4' color="green"
          type='submit'>Upload file</Button>
			</div>
    </>
  )
}

export default BulkAdd