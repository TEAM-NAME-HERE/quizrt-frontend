import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

const decorate = withStyles(({ palette, spacing }) => ({
  card: {
  } as React.CSSProperties,
  content: {
    display: 'flex',
    flexFlow: 'column nowrap',
  } as React.CSSProperties
}));

// tslint:disable-next-line:no-any
class RegisterComponent
  extends React.Component<WithStyles<'card'> & WithStyles<'content'> & {style: React.CSSProperties}> {
  render() {
    // tslint:disable-next-line:no-any
    const { classes, style } = this.props;
    return (
      <Card style={style} className={classes.card}>
        <CardContent>
          <Typography type="display3" component="h2">
            Register
          </Typography>
          <Typography type="headline">
            Sign up for Quizirt - It'll only take a moment...
          </Typography>
          <form className={classes.content} noValidate={true} autoComplete="off">
            <TextField
              id="name"
              label="Full Name"
              required={true}
            />
            <TextField
              id="email"
              type="email"
              label="Email"
              required={true}
            />
            <TextField
              id="password1"
              type="password"
              label="Password"
              required={true}
            />
            <TextField
              id="password2"
              type="password"
              label="Confirm Password"
              required={true}
            />
          </form>
          <Typography style={{marginTop: 15}} type="caption">Already have an account with us?
            Head to our <Link to="/login"> login page </Link>
          </Typography>
        </CardContent>
        <CardActions>
          <Button dense={true} color="primary">Register</Button>
        </CardActions>
      </Card>
    );
  }
}

export default decorate<{style: React.CSSProperties}>(RegisterComponent);
