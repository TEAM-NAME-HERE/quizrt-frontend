import * as React from 'react';
import { Header } from './components';
import { Home, About, Explore, Login, Register } from './pages';
// import { ThemeProvider } from './components/styled-components';
import { MuiThemeProvider } from 'material-ui/styles';
import { blueTheme, redTheme, greenTheme } from './components/styles/theme';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import 'typeface-roboto';

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={blueTheme}>
      <Router>
        <div className="App">
          <Header />

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
    );
  }
}

export default App;
