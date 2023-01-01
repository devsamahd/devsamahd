import { PortableText } from "@portabletext/react"
import Meta from "../../components/general/Meta"
import { sanityClient } from "../../lib/sanity"
import {urlFor} from '../../lib/sanity'


const SampleImageComponent = ({value}) => {
  return (
    <img
      src={
        urlFor(value)}
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

const course = ({post}) => {
  return (
    <div className='container row mt-5'>
      <Meta title={post.title} description={post.description} />
      <div className="col-md-1"></div>
      <div className="col-md-8"><PortableText value={post.body} components={components} /></div>
      <div className="col-md-3"></div>
        
    </div>
  )
}



export const getStaticProps = async({params}) => {
  const {slug} = params
    const post = await sanityClient.fetch(postQuery,{slug})
    
    return {props: {post}} 
}

export const getStaticPaths = async () => {
    const paths = await sanityClient.fetch('*[_type == "post" && defined(slug.current)]{"params":{"slug":slug.current}}')
    return {
        paths,
        fallback:false
    }
}

export default course