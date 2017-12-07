import * as React from 'react';
import { LoginForm } from '../components';
// import Button, { ButtonProps } from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { Helmet } from 'react-helmet';
import { GuestLogin } from '../components/Login/';
// import { css } from 'glamor';

// const btnDecorate = withStyles(({ typography }) => ({
//   root: typography.display2
// }));

// const BigButton = btnDecorate<ButtonProps>((props) => ( <Button {...props} /> ));

const decorate = withStyles(({ typography, breakpoints }) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    [breakpoints.down('md')]: {
      padding: 0
    }
  } as React.CSSProperties,
  element: {
    marginTop: 20
  }
}));

const Login = decorate(({ classes }) => (
    <div className={classes.container} >
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginForm className={classes.element} style={{width: '600px'}} />
      <GuestLogin />
    </div>
));

export default Login;
