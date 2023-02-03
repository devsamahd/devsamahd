import moment from 'moment'
import Link from 'next/link'
import { SectionNumber } from './ProjectSection'


const BlogSection = ({blog}:{blog:any[]}) => {
  return (
    <>
    <SectionNumber title='Technical Write-up' number={3} />
    <div className="mt-5 mb-5">
        {blog && (blog.slice(0,5)).map((post:any)=>(
        <div className="mt-2" key={post.slug.current} style={{"borderBottom":"1px solid gray"}}>
            <div className="d-flex" style={{"justifyContent":"space-between"}}>
                  <Link href={`/${post.slug.current}`}><b>{post.title}</b></Link>
                  <div className="card-text text-secondary">{moment(post._createdAt).format("ddd, D MMM YYYY.")}</div>
            </div>
        </div>
        )
        
        )}
    </div>
    </>
  )
}

export default BlogSection