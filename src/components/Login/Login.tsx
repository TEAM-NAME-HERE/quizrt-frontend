import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { graphql, ChildProps } from 'react-apollo';
import { Link, Redirect } from 'react-router-dom';
import { LoginUserMutation, LoginUserMutationVariables } from '../../graphql/graphql';
import { store } from '../../App';
import { setUser } from '../../actions/user';

const decorate = withStyles(({ palette, spacing }) => ({
  card: {
  } as React.CSSProperties,
  content: {
    display: 'flex',
    flexFlow: 'column nowrap',
  } as React.CSSProperties
}));

export interface Props {
  style?: React.CSSProperties;
  className?: string;
}

type AllProps = WithStyles<'card'>
              & WithStyles<'content'>
              & ChildProps<Props, LoginUserMutation>;

interface State {
  email: string;
  password: string;
  error?: string;
  redirect?: boolean;
}

const LOGIN_MUTATION = require('../../graphql/mutations/Login.graphql');

const queryVars = (props: State): LoginUserMutationVariables => ({
  password: props.password,
  email: props.email
});

const loginMutate = graphql<LoginUserMutation, Props>(LOGIN_MUTATION, {});

class LoginComponent extends React.Component<AllProps, State> {
  constructor(props: AllProps) {
    super(props);

    const userUuid = store.getState().user.uuid;

    this.state = {
      email: '',
      password: '',
      redirect: !!userUuid
    };
  }

  submit = async () => {
    const { mutate } = this.props;

    const result = await mutate!({
      variables: queryVars(this.state)
    });
    if (result.errors && result.errors[0].message === '401 Unauthorized') {
      this.setState({
        ...this.state,
        error: 'Invalid username or password',
        redirect: false
      });
    } else if (!result.data.loginUser) {
      this.setState({
        ...this.state,
        error: 'Unknown server error',
        redirect: false
      });
    } else {
      this.setState({
        ...this.state,
        error: undefined,
        redirect: true
      });
      if (result.data.loginUser.user.id) {
        store.dispatch(setUser(result.data.loginUser.user.id));
      }
    }
  }

  handleKeyUp = async (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (evt.keyCode === 13) {
      evt.persist();
      await this.submit();
    }
  }

  // tslint:disable-next-line:no-any
  handleClick = async (evt: React.MouseEvent<any>) => {
    await this.submit();
  }

  handleChange = (name: 'email'|'password') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState((s, p) => ({
      ...s,
      [name]: value
    }));
  }

  render() {
    // const { from } = this.props.location.state || '/'
    const from = false;
    const { classes, style, className } = this.props;
    return (
      <Card style={style ? style : {}} className={`${classes.card} ${className ? className : ''}`}>
        <CardContent>
          <Typography type="display3" component="h2">
            Login
          </Typography>
          <form className={classes.content} noValidate={true} autoComplete="off">
            <TextField
              id="email"
              label="Email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              required={true}
            />
            <TextField
              id="password"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.handleChange('password')}
              required={true}
              onKeyUp={this.handleKeyUp}
            />
          </form>
          {this.state.error && <Typography type="caption" color="error">{this.state.error}</Typography>}
          <div>
            <Typography type="caption">Forgot your username or password?
              <Link to="/forgot-password"> Click here </Link>
            </Typography>
            <Typography type="caption">New to Quizirt? You can
              <Link to="/register"> sign up here</Link>
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Button dense={true} color="primary" onClick={this.handleClick}>Login</Button>
        </CardActions>
        {this.state.redirect && <Redirect to={from || '/'} />}
      </Card>
    );
  }
}

export default loginMutate(decorate<Props>(LoginComponent));
