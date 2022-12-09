import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AboutMe from "./pages/AboutMe"
import Newsletter from "./pages/Newsletter"
import Layout from "./components/Layout"
import { DataProvider } from "./context/DataContext"
import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/all.css'



function App() {
  
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
            <Route element={<Layout/>}>
              <Route index element={<LandingPage />} />
              <Route exact path="/about" element={<AboutMe />} />
              <Route path="/newsletter" element={<Newsletter />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>

  )
}

export default App
