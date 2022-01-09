import { Provider } from 'react-redux';
import './App.css';
import MainPage from './page/mainPage';
import store from './store/store'



function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainPage />
      </div>
    </Provider>

  );
}

export default App;
