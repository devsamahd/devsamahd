import { LinkIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import Meta from '../components/Head'
import { SectionNumber } from '../components/ProjectSection'
import { SanityClient } from '../lib/sanity'

const Blog = ({blogs}: {blogs: any}) => { 
  const art23 = blogs.filter((blo:any)=> moment(blo._createdAt).format("YYYY") == "2023")
  return (
    <>
    <Meta title="Writing | DevSamahd" />
    <div className="row">
    <div className="col-md-2"></div>
    <div className='col-md-8'>
      <br />
    <SectionNumber title='Writing' number={1} />

    <Heading size={"lg"} mt={10}>2022</Heading>
    <Box mt={3}>
    {
      art23 && ((art23.reverse()).map((blog:any) => (
        
          <Flex justifyContent={'space-between'} >
            <Text><Link href={`/${blog.slug.current}`}>{blog.title}<LinkIcon /></Link></Text>
            <Text>{moment(blog._createdAt).format('dddd, D MMM')}</Text>
          </Flex>
      )))
    }
    </Box>
    <Box mt={3}>
    {
      blogs && ((blogs.filter((blo:any) => (moment(blo._createdAt).format("YYYY") == "2022")))).map((blog:any) => (
        
          <Flex justifyContent={'space-between'} >
            <Text><Link href={`/${blog.slug.current}`}>{blog.title}<LinkIcon /></Link></Text>
            <Text>{moment(blog._createdAt).format('dddd, D MMM')}</Text>
          </Flex>
      ))
    }
    </Box>
    
    
    <div className='mb-5 mt-5'>
        <SectionNumber title='Newsletter' number={2} />
        <Text>Sign up to get updates when I write something new. No spam ever.</Text><br /><br />
        <Link href={"https://samahd.substack.com"}><Button>Subscribe to Newsletter</Button></Link>
    </div>

    </div>
    </div>
    </>
    
  )
}

export default Blog


export const getStaticProps = async() => {
  const blogs = await SanityClient.fetch('*[_type == "post"]')
  return {
    props:{
      blogs
    }
  }
}