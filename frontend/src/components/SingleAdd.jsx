import { Button, Label, TextInput } from 'flowbite-react'
import { HiLink } from 'react-icons/hi'

function SingleAdd() {
  return (
    <>
      <form className="flex max-w-md flex-col gap-4">
				<div>
					<div className='mb-2 block'>
						<Label htmlFor='url' value='URL' />
					</div>
					<TextInput id='url' type='link' name='url'
						placeholder='https://example.com' required rightIcon={HiLink} />
				</div>
				<Button type='submit' color='green'>Add URL</Button>
			</form>
    </>
  )
}

export default SingleAdd