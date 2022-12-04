import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AboutMe from "./pages/AboutMe"
import Contact from "./pages/Contact"
import Newsletter from "./pages/Newsletter"
import Projects from "./pages/Projects"
import Layout from "./components/Layout"
import './assets/css/all.css'
import { useState } from "react"


function App() {
  const [theme, setTheme] = useState(true)
  
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<Layout theme={theme} setTheme={setTheme} />}>
            <Route index element={<LandingPage />} />
            <Route exact path="/about" element={<AboutMe />} />
            <Route path="/projects" element={<Projects /> } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/newsletter" element={<Newsletter />} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
