import { DataProvider } from './store'
import MyApp from './MyApp'

function App() {

  return (
    <DataProvider>
      <MyApp />
    </DataProvider>
  )
}

export default App
