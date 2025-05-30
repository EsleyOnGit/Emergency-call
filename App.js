import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Setting from './src/screens/Setting';
import Routes from './src/routes/routes';
import InformationProvider from './src/context/formInfo';
//import { InformationsContext } from './src/context/formInfo'
export default function App() {

  return (
    <InformationProvider>
      <Routes />
    </InformationProvider>
  )
}
