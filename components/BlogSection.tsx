import { LinkIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import moment from 'moment'
import Link from 'next/link'
import { urlFor } from '../lib/sanity'
import { SectionNumber } from './ProjectSection'


const BlogSection = ({blog}:{blog:any[]}) => {
  return (
    <>
    <SectionNumber where={false} number={2} />
    <Heading size={'lg'} fontFamily={'inherit'} textAlign="right">Technical WriteUps</Heading>
    <div className="mt-5 mb-5">
        {blog && (blog.slice(0,5)).map((post:any)=>(
        <div className="mt-2" key={post.slug.current} style={{"borderBottom":"1px solid"}}>
            <div className="row g-3">
                <div className="col-md-2">
                <img src={urlFor(post.mainImage).url()} className="img-fluid rounded-start inv" width={"100%"} alt="..." />
                </div>
                <div className="col-md-10">
                <div className="card-body">
                    <Link href={`/${post.slug.current}`}><Heading size={"md"}>{post.title}<LinkIcon /></Heading></Link>
                    <Text noOfLines={2}>{post.intro}</Text>
                    <div className="card-text">{moment(post._createdAt).format("dddd D MMM YYYY")}</div>
                </div>
                </div>
            </div>
        </div>
        )
        
        )}
    </div>
    </>
  )
}

export default BlogSection