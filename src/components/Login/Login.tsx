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

interface Props {
  style?: React.CSSProperties;
  className?: string;
}

// tslint:disable-next-line:no-any
class LoginComponent
  extends React.Component<WithStyles<'card'> & WithStyles<'content'> & Props> {
  render() {
    // tslint:disable-next-line:no-any
    const { classes, style, className } = this.props;
    return (
      <Card style={style ? style : {}} className={`${classes.card} ${className ? className : ''}`}>
        <CardContent>
          <Typography type="display3" component="h2">
            Login
          </Typography>
          <form className={classes.content} noValidate={true} autoComplete="off">
            <TextField
              id="username"
              label="Username"
              required={true}
            />
            <TextField
              id="password"
              type="password"
              label="Password"
              required={true}
            />
          </form>
        </CardContent>
        <div style={{padding: '10px'}}>
          <Typography type="caption">Forgot your username or password?
            <Link to="/forgot-password"> Click here </Link>
          </Typography>
          <Typography type="caption">New to Quizirt? You can
            <Link to="/register"> sign up here</Link>
          </Typography>
        </div>
        <CardActions>
          <Button dense={true} color="primary">Login</Button>
        </CardActions>
      </Card>
    );
  }
}

export default decorate<Props>(LoginComponent);
