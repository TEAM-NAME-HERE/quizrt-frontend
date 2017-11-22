import * as React from 'react';
import { HeaderContainer } from './components';
import { Home, About, Explore, Login, Register, GuestHome } from './pages';
import { MuiThemeProvider } from 'material-ui/styles';
import { blueTheme } from './components/styles/theme';
import { ApolloProvider } from 'react-apollo';
import { ApolloCache } from 'apollo-cache';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { USER_ID } from './constants';
import Typography from 'material-ui/Typography';
import { setUser } from './actions/user';
import { setTheme } from './actions/theme';
import reducer, { State } from './reducers';
import 'typeface-roboto';
import { withRouter } from 'react-router';

export let store = createStore<State>(
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

const NoMatch = withRouter(({ location }) => (
  <div>
    <Typography type="display3"> 404 Not Found ... </Typography>
    <Typography type="headline"> Page {location.pathname} not found </Typography>
  </div>
));

const mapStateToProps = (state: State) => ({
  theme: state.theme.theme,
  user: state.user.uuid
});

const withTheme = connect(mapStateToProps);

const AppBody = withTheme(({ theme, user }) => (
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <Router>
      <div className="App">
          <HeaderContainer />
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100% - 128px - (24px * 2))',
            }}
          >
          <Switch>
            { user === ''
            ? <Route exact={true} path="/" component={GuestHome} />
            : <Route exact={true} path="/" component={Home} />
            }
            <Route path="/about" component={About} />
            <Route path="/explore" component={Explore} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route component={NoMatch} />
          </Switch>
          </div>
      </div>
      </Router>
    </MuiThemeProvider>
  </ApolloProvider>
));

class App extends React.Component {
  render() {
    const userId = localStorage.getItem(USER_ID);
    if (userId) {
      store.dispatch(setUser(userId));
    }
    store.dispatch(setTheme(blueTheme));
    return (
      <Provider store={store} >
        <AppBody />
      </Provider>
    );
  }
}

export default App;
