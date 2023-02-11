import { Heading, Stack, Text } from "@chakra-ui/react"
import { PortableText } from "@portabletext/react"
import Meta from "../components/Head"
import { SanityClient } from "../lib/sanity"
import {urlFor} from '../lib/sanity'
import Refractor from 'react-refractor'
import js from 'refractor/lang/javascript'
import jsx from 'refractor/lang/jsx'
import bash from 'refractor/lang/bash'
import powershell from 'refractor/lang/powershell'
import moment from "moment"
import Tags from "../components/Tags"

Refractor.registerLanguage(js)  
Refractor.registerLanguage(jsx)  
Refractor.registerLanguage(bash)  
Refractor.registerLanguage(powershell)  

const CodeComponent = ({value:{language, code, highlightedLines}}: {value:{language?:any,code?:any,highlightedLines?:any}})=> {
  return (
    <Refractor
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
  marks:{
    link: ({value, children}:{value:any, children:any}) => {
      return (
        <a href={value?.href} target={"_blank"} style={{'color':'blue', fontWeight:"600"}}>
          {children}
        </a>
      )
    }
  }
}
const postQuery = '*[_type == "post" && slug.current == $slug][0]{..., categories[]->}'

const course = ({post}:{post:any}) => { 
  return (
    <div className='row'>
      
      <Meta title={post.title} desc={post.description} image={urlFor(post.mainImage).url()} type="Article" />
      <div className="col-md-2"></div>
      <div className="col-md-8 pt-5 container" >
            <br /><br /><br /><br />
            <div className="row">
              <div className="col-md-2">
                <img src={urlFor(post.mainImage).url()} alt=""/>
              </div>
              <div className="col-md-10">
                <Heading size={'lg'}>{post.title}</Heading>
                <br />
                <div className="d-flex justify-content-between">
                  <Tags heading="" tags={post.categories.map((tag:any) => tag.title)} />

                  <Text>-{moment(post._createdAt).format("dddd, D MMM YYYY")}</Text>
                </div>
              </div>
            </div>
            
            
            <br />
            <hr />
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