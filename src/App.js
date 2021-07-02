import { createStore } from "redux";
import { Provider } from "react-redux";
import allReducers from "./Store/reducers";
import Results from './Components/Results';
import SearchComponent from './Components/SearchComponent';

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <SearchComponent />
        <Results />
      </Provider>
    </div>
  );
}

export default App;
