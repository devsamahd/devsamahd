import React from 'react'


const ThemeButton = ({theme, setTheme}) => {
    const handleclick = () => {
        setTheme(!theme)
    }
  return (
    <div className="theme-btn" onClick={handleclick}>{theme?"🌜":"🌞"}</div>
  )
}

export default ThemeButton