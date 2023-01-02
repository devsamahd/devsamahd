import { PortableText } from "@portabletext/react"
import Meta from "../components/Head"
import { SanityClient } from "../lib/sanity"
import {urlFor} from '../lib/sanity'


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

const components = {
  types: {
    image: SampleImageComponent
  },
}
const postQuery = '*[_type == "post" && slug.current == $slug][0]'

const course = ({post}:{post:any}) => {
  return (
    <div className='container row mt-5'>
      <Meta title={post.title} desc={post.description} />
      <div className="col-md-1"></div>
      <div className="col-md-8"><PortableText value={post.body} components={components} /></div>
      <div className="col-md-3"></div>
        
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