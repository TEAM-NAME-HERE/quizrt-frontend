import * as React from 'react';
import { LoginForm } from '../components';
import Button, { ButtonProps } from 'material-ui/Button';
import { withStyles, WithStyles } from 'material-ui/styles';
// import { css } from 'glamor';

const btnDecorate = withStyles(({ typography }) => ({
  root: typography.display2
}));

const BigButton = btnDecorate<ButtonProps>((props) => ( <Button {...props} /> ));

const decorate = withStyles(({ typography, breakpoints }) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: 100,
    [breakpoints.down('md')]: {
      padding: 0
    }
  } as React.CSSProperties,
  element: {
    marginTop: 20
  }
}));

export class Login extends React.Component<WithStyles<'container'> & WithStyles<'element'>> {
  render() {
    const {classes} = this.props;
    return (
    <div className={classes.container} >
      <LoginForm className={classes.element} style={{width: '600px'}} />
      <BigButton
        className={classes.element}
        style={{color: 'white'}}
        raised={true}
        color="primary"
      >
      Continue as Guest
      </BigButton>
    </div>
  );
  }
}

export default decorate<{}>(Login);
