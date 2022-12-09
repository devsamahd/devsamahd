import {createContext, useState} from 'react'

const DataContext = createContext({})

export const DataProvider = ({children}) => {
  const [theme, setTheme] = useState(true)

    return(
        <DataContext.Provider value={{
            theme,
            setTheme
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext