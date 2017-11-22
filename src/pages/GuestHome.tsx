import * as React from 'react';
// import { LoginForm } from '../components';
import { RegisterForm } from '../components';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { store } from '../App';
import { setTheme } from '../actions/theme';
import { blueTheme } from '../components/styles/theme';

const decorate = withStyles(({palette, breakpoints}) => ({
  container: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
    [breakpoints.down('sm')]: {
      flexFlow: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  } as React.CSSProperties,
  text: {
    marginBottom: '5px',
    wordWrap: 'break-word',
    [breakpoints.down('sm')]: {
      textAlign: 'center',
    }
  },
  textContainer: {
    maxWidth: '50%',
    [breakpoints.down('sm')]: {
      maxWidth: '100%',
    }
  },
  form: {
    maxWidth: '50%',
    marginLeft: '10px',
    [breakpoints.down('sm')]: {
      maxWidth: '100%',
      marginRight: '10px',
    }
  }
}));

const GuestHome = decorate(({ classes }) => {
  store.dispatch(setTheme(blueTheme));
  return (
  <div className={classes.container}>
    <div className={classes.textContainer}>
      <Typography className={classes.text} type="display3">Built for Quizzers</Typography>
      <Typography className={classes.text} type="headline" component="p">
        Quizrt is a quiz creation platform inspired by the way you quiz.
        For open source and schools, you can host and review quizzes, manage classes,
        and build surveys alongside millions of other people.
      </Typography>
    </div>
    <RegisterForm className={classes.form} />
  </div>
  );
});

export default GuestHome;
