import React from 'react'

const BlogSection = ({blog}:{blog:any[]}) => {
    console.log(blog)
  return (
    <div className='row'>
        {blog && blog.map((post:any[])=>(<div className="col-md-4">

        <div className="card mb-3" style={{"maxWidth":"20rem"}}>
            <div className="row g-0">
                <div className="col-md-4">
                <img src="me.svg" className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <div className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</div>
                    <div className="card-text">Last updated 3 mins ago</div>
                </div>
                </div>
            </div>
        </div>

        </div>))}
        
    </div>
  )
}

export default BlogSection