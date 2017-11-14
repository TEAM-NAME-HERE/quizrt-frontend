import * as React from 'react';
import { RegisterForm } from '../components';
// import Button, { ButtonProps } from 'material-ui/Button';
import { withStyles, WithStyles } from 'material-ui/styles';
// import { css } from 'glamor';

const decorate = withStyles(({ palette }) => ({
  container: {
    backgroundColor: palette.primary[500],
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 128px)'
  } as React.CSSProperties
}));

export class Register extends React.Component<WithStyles<'container'>> {
  render() {
    const { classes } = this.props;
    return (
    <div className={classes.container} >
      <RegisterForm style={{width: '600px'}} />
    </div>
  );
  }
}

export default decorate<{}>(Register);
