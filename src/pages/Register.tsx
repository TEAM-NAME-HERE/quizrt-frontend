import * as React from 'react';
import { RegisterForm } from '../components';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { compose } from 'redux';
import { setTheme } from '../actions/theme';
import { redTheme } from '../components/styles/theme';

const decorate = withStyles(({ palette }) => ({
  container: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties
}));

// tslint:disable-next-line:no-any

const wrapper = compose(decorate, connect());

// tslint:disable-next-line:no-any
const Register = wrapper((props: any) => {
  props.dispatch(setTheme(redTheme));
  return (
    <div className={props.classes.container} >
      <RegisterForm style={{width: '600px'}} />
    </div>
  );
});

export default Register;
