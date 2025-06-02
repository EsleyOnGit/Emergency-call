import Routes from './src/routes/routes';
import InformationProvider from './src/context/formInfo';
import SettingProvider from './src/context/settingsContext';
//import { InformationsContext } from './src/context/formInfo'
export default function App() {

  return (
    <InformationProvider>
      <SettingProvider>
        <Routes />
      </SettingProvider>
    </InformationProvider>
  )
}
