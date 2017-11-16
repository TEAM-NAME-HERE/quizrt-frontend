import * as React from 'react';
import { HeaderContainer } from './components';
import { Home, About, Explore, Login, Register } from './pages';
// import { ThemeProvider } from './components/styled-components';
import { MuiThemeProvider } from 'material-ui/styles';
import { blueTheme, redTheme, greenTheme } from './components/styles/theme';
import { ApolloProvider } from 'react-apollo';
import { ApolloCache } from 'apollo-cache';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { USER_ID } from './constants';
import { setUser } from './actions/user';
import reducer from './reducers';
import 'typeface-roboto';

export let store = createStore(
  reducer,
  // tslint:disable-next-line:no-any
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    credentials: 'include'
  }),
  // tslint:disable-next-line:no-any
  cache: new InMemoryCache() as ApolloCache<NormalizedCacheObject>
});

class App extends React.Component {
  render() {
    const userId = localStorage.getItem(USER_ID);
    if (userId) {
      store.dispatch(setUser(userId));
    }
    return (
      <Provider store={store} >
      <ApolloProvider client={client}>
      <MuiThemeProvider theme={blueTheme}>
      <Router>
        <div className="App">
          <HeaderContainer />

          <MuiThemeProvider theme={greenTheme}>
            <Route exact={true} path="/" component={Home} />
          </MuiThemeProvider>
          <Route path="/about" component={About} />
          <Route path="/explore" component={Explore} />
          <Route path="/login" component={Login} />
          <MuiThemeProvider theme={redTheme}>
            <Route path="/register" component={Register} />
          </MuiThemeProvider>
        </div>
      </Router>
      </MuiThemeProvider>
      </ApolloProvider>
      </Provider>
    );
  }
}

export default App;
