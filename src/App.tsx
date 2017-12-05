import * as React from 'react';
import { HeaderContainer } from './components';
import { Home, About, Explore, Login, Register, GuestHome } from './pages';
import EnterSession from './components/EnterSession/EnterSession';
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
  Switch,
} from 'react-router-dom';
import {
  RouteComponentProps
} from 'react-router';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { USER_ID } from './constants';
import Typography from 'material-ui/Typography';
import { setUser } from './actions/user';
import { setTheme } from './actions/theme';
import reducer, { State } from './reducers';
import 'typeface-roboto';
import { withRouter } from 'react-router';
import { EditQuiz } from './components/Quiz';
import Button from 'material-ui/Button';
import { Helmet } from 'react-helmet';
import StudentView from './pages/StudentView';

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

const withTheme = connect((state: State) => ({
  theme: state.theme.theme,
  user: state.user
}));

export const routes = [
  {
    path: '/about',
    exact: false,
    component: About
  },
  {
    path: '/explore',
    exact: false,
    component: Explore
  },
  {
    path: '/login',
    exact: false,
    component: Login
  },
  {
    path: '/register',
    exact: false,
    component: Register
  },
  {
    path: '/entersession',
    exact: false,
    component: EnterSession
  },
  {
    path: '/session/:id/student',
    exact: false,
    component: ({match}: RouteComponentProps<{id: string}>) => <StudentView session={match.params.id} />
  },
  {
    path: '/classes/:cid/settings',
    exact: true,
    component: (props: RouteComponentProps<{cid: string}>) => (
      <div> Class {props.match.params.cid} Settings </div>
    )
  },
  {
    path: '/:cid',
    exact: true,
    component: (props: RouteComponentProps<{cid: string}>) => (<div>Class {props.match.params.cid} Quizzes</div>)
  },
  {
    path: '/:cid/:qid',
    exact: true,
    component: (props: RouteComponentProps<{cid: string, qid: string}>) => (
    <div>
      <p> Class {props.match.params.cid}</p>
      <p> Quiz {props.match.params.qid}</p>
    </div>)
  },
  {
    path: '/:cid/:qid/edit',
    exact: true,
    component: (props: RouteComponentProps<{cid: string, qid: string}>) => (
      <div>
        <Button raised={true} onClick={() => props.history.goBack()}>Done</Button>
        <EditQuiz
          profile={props.match.params.cid}
          quiz={props.match.params.qid}
          onDelete={() => props.history.goBack()}
        />
      </div>
    )
  },

];

const AppBody = withTheme(({ theme, user }) => (
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <Router>
      <div className="App">
        <Helmet>
          <meta name="theme-color" content={theme.palette.primary[500]} />
        </Helmet>
          <HeaderContainer />
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100% - 128px - (24px * 2))',
            }}
          >
          <Switch>
            { user.uuid === ''
            ? <Route exact={true} path="/" component={GuestHome} />
            : user.isGuest
            ? <Route exact={true} path="/" component={GuestHome} />
            : <Route exact={true} path="/" component={Home} />
            }
            {
              routes.map((r, idx) => (
                <Route
                  key={idx}
                  exact={r.exact}
                  path={r.path}
                  component={r.component}
                />))
            }
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
