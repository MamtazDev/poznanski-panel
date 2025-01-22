import AppMain from "./AppMain";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./reducers";
import "./App.css";

function App() {
  return (
    <div className={`App`}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider>
            <BrowserRouter>
              <AppMain />
            </BrowserRouter>
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
