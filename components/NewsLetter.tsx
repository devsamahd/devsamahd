import { Button, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { SectionNumber } from './ProjectSection'

const NewsLetter = () => {
  return (
    <div className='mb-5'>
        <SectionNumber where={true} number={3} />
        <Heading size={'lg'} fontFamily={'inherit'} textAlign="left">Newsletter</Heading>
        <Text>Sign up to get updates when I write something new. No spam ever.</Text><br /><br />
        <Link href={"https://samahd.substack.com"}><Button>Subscribe to Newsletter</Button></Link>
    </div>
  )
}

export default NewsLetter