import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div>
      <Navbar/>
        <main className="container">
            <Outlet/>
        </main>
      <Footer />
    </div>
  )
}

export default Layout