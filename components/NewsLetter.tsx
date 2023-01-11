import { Button, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { SectionNumber } from './ProjectSection'

const NewsLetter = () => {
  return (
    <div className='mb-5 mt-5'>
        <SectionNumber title='Newsletter' number={6} />
        <Text>Sign up to get updates when I write something new. No spam ever.</Text><br /><br />
        <Link href={"https://samahd.substack.com"}><Button>Subscribe to Newsletter</Button></Link>
    </div>
  )
}

export default NewsLetter