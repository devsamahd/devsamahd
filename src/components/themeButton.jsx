import { useContext, useEffect } from 'react'
import DataContext from '../context/DataContext'


const ThemeButton = () => {
  const {theme, setTheme} = useContext(DataContext)
  useEffect(()=>{
    if(theme){
   document.querySelector('.body').classList.add('light')
   document.querySelector('.body').classList.remove('dark')
    }else{
      document.querySelector('.body').classList.add('dark')
      document.querySelector('.body').classList.remove('light')
    }
  }, [theme])
    const handleclick = () => {
        setTheme(!theme)
    }
  return (
    <div className="theme-btn" onClick={handleclick}>{theme?<img src="moon.svg" alt="" />:<img src="sun.svg" alt="" />}</div>
  )
}

export default ThemeButton