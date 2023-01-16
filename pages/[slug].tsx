import { Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { PortableText } from "@portabletext/react"
import Meta from "../components/Head"
import { SanityClient } from "../lib/sanity"
import {urlFor} from '../lib/sanity'
import Refractor from 'react-refractor'
import js from 'refractor/lang/javascript'
import moment from "moment"

Refractor.registerLanguage(js)  

const CodeComponent = ({value:{language, code, highlightedLines}}: {value:{language?:any,code?:any,highlightedLines?:any}})=> {
  return (
    <Refractor
      // In this example, `props` is the value of a `code` fi
      language={language}
      value={code}
      markers={highlightedLines}
    />
  )
}

const SampleImageComponent = ({value}:{value:any}) => {
  return (
    <img
      src={
        urlFor(value).url()
    }
      alt={'blog image'}
    />
  )
}

const components:any = {
  types: {
    image: SampleImageComponent,
    code: CodeComponent
  },
}
const postQuery = '*[_type == "post" && slug.current == $slug][0]'

const course = ({post}:{post:any}) => {
  return (
    <div className='row'>
      
      <Meta title={post.title} desc={post.description} />
      <div className="col-md-2"></div>
      <div className="col-md-8 pt-5 container" >
        
            <Heading size={'lg'}>{post.title}</Heading>
            <Text>{post.intro}</Text><br />
            <Text>-{moment(post._createdAt).format("dddd, D MMM YYYY")}</Text>
            <hr />
            <br />
            <br />
          <Stack mt={5}>
          <PortableText value={post.body} components={components}/>
          </Stack>
        
        </div>
      <div className="col-md-2"></div>
        
    </div>
  )
}



export const getStaticProps = async({params}:{params:any}) => {
  const {slug} = params
    const post = await SanityClient.fetch(postQuery,{slug})
    
    return {props: {post}} 
}

export const getStaticPaths = async () => {
    const paths = await SanityClient.fetch('*[_type == "post" && defined(slug.current)]{"params":{"slug":slug.current}}')
    return {
        paths,
        fallback:false
    }
}

export default course