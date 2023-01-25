import { SectionNumber } from './ProjectSection'

const About = () => {
  return (
    <>
        <SectionNumber number={1} title={`About me`} />
        <div className="row">

          <div className="col-md-7">
            <b>
          Hello! My name is Abdulsamad and I enjoy creating things that live on the internet. My interest in web development started back in 2019 when I decided to take a bootcamp. I majored in backend with PHP and MySQL, subsequently I went into frontend.

            </b>
          </div>

          <div className="col-md-5">
            <img src="mehuman.jpg" alt="" width={'200px'} />
          </div>

        </div>
    </>
         
  )
}

export default About