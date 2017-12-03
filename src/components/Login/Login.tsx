import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { graphql, compose } from 'react-apollo';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { LoginUserMutation } from '../../graphql/graphql';
import { setUser } from '../../actions/user';
import { USER_ID } from '../../constants';
import { noop } from '../../util';
import { connect } from 'react-redux';
import { ApolloQueryResult } from 'apollo-client';

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

interface State {
  email: string;
  password: string;
  error?: string;
}

export interface LoginCardProps {
  style?: React.CSSProperties;
  className?: string;
  elevation?: number;
  onSubmit?: (cred: State) => Promise<void>;
}

type AllProps = WithStyles<'card'>
              & WithStyles<'content'>
              & LoginCardProps;

class LoginCardComponent extends React.Component<AllProps, State> {
  constructor(props: AllProps) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  private submit = () => {
    const { onSubmit } = this.props;
    (onSubmit || noop)(this.state).catch(e => {
      // tslint:disable-next-line:no-console
      console.log('error');
      this.setState({
        error: e.message
      });
    });
  }

  private handleKeyUp = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter') {
      evt.persist();
      this.submit();
    }
  }

  // tslint:disable-next-line:no-any
  private handleClick = (evt: React.MouseEvent<any>) => {
    this.submit();
  }

  private handleChange = (name: 'email'|'password') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState((s, p) => ({
      ...s,
      [name]: value
    }));
  }

  // tslint:disable-next-line:member-ordering
  render() {
    const { classes, style, className, onSubmit, ...rest } = this.props;
    return (
      <Card {...rest} style={style} className={`${classes.card} ${className ? className : ''}`}>
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
      </Card>
    );
  }
}

export const LoginCard = decorate<LoginCardProps>(LoginCardComponent);

interface MutateProps {
  login: (creds: {email: string, password: string}) => Promise<ApolloQueryResult<LoginUserMutation>>;
}

const LOGIN_MUTATION = require('../../graphql/mutations/Login.graphql');
const loginMutate = graphql<LoginUserMutation, Props & MutateProps>(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ email, password }) => {
      return mutate!({
        variables: {
          email,
          password
        }
      });
    }
  } as Partial<MutateProps & Props>)
});

const Login = compose(
  withRouter,
  loginMutate
)(connect(null, (d) =>
  ({ saveUser: async (id: string) => d(setUser(id)) })
)((props) => {
  const { saveUser, match, location, history,
          staticContext, login, ...rest } = props as (typeof props) & MutateProps & RouteComponentProps<{}>;
  const error = (e: Error) => {
    if (e.message.indexOf('401 Unauthorized') >= 0) {
      throw new Error('Invalid username or password');
    } else {
      throw new Error('Unknown server error');
    }
  };

  const submit = async (cred: State) => {
    let result;
    try {
      result = await login(cred);
    } catch (e) {
      error(e);
      return;
    }

    if (result.errors) {
      error(result.errors[0]);
      return;
    } else if (!result.data.loginUser) {
      throw 'Unknown server error';
    } else {
      if (result.data.loginUser.user.id) {
        localStorage.setItem(USER_ID, result.data.loginUser.user.id);
        await saveUser(result.data.loginUser.user.id);
        history.replace(staticContext && staticContext.from || '/');
      }
    }
  };

  return (
    <LoginCard {...rest} onSubmit={submit} />
  );
})) as React.ComponentType<Props>;

export default Login;
