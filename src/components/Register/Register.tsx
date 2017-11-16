import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import { CreateUserMutation, CreateUserMutationVariables } from '../../graphql/graphql';
import { graphql, ChildProps } from 'react-apollo';

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
              & ChildProps<Props, CreateUserMutation>;

interface State {
  email: string;
  name: string;
  password: string;
  passwordMatch: boolean;
  passwordConfirm: string;
  valid: boolean;
  error?: string;
  redirect?: boolean;
}

const REGISTER_MUTATION = require('../../graphql/mutations/Register.graphql');

const queryVars = (props: State): CreateUserMutationVariables => ({
  password: props.password,
  email: props.email,
  name: props.name,
  username: props.email
});

const registerMutate = graphql<CreateUserMutation, Props>(REGISTER_MUTATION, {});

// tslint:disable-next-line:no-any
class RegisterComponent extends React.Component<AllProps, State> {
  constructor(props: AllProps) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      valid: false,
      passwordMatch: true,
    };
  }

  submit = async () => {
    const { mutate } = this.props;

    const result = await mutate!({
      variables: queryVars(this.state)
    });

    if (result.data.createUser) {
      this.setState({
        ...this.state,
        error: undefined,
        redirect: true
      });
    } else {
      this.setState({
        ...this.state,
        error: 'Unknown server error',
        redirect: false
      });
    }
  }

  handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState((s, p) => ({
      ...s,
      [name]: value,
      valid: this.isValid({
        ...s,
        [name]: value
      })
    }));
  }

  handleConfirm = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.handleChange(name)(event);
    const value = event.target.value;

    if (
      name === 'password' && value === this.state.passwordConfirm ||
      name === 'passwordConfirm' && value === this.state.password
    ) {
      this.setState((s, p) => ({
        ...s,
        passwordMatch: true,
        valid: this.isValid({
          ...s,
          passwordMatch: true
        })
      }));
    } else {
      this.setState((s, p) => ({
        ...s,
        passwordMatch: false
      }));
    }
  }

  isValid = (s = this.state) => {
    const v = s.email !== ''
    && s.password !== ''
    && s.name !== ''
    && s.passwordMatch;
    // tslint:disable-next-line:no-console
    console.log('in valid', v);
    return v;
  }

  render() {
    // tslint:disable-next-line:no-any
    const { classes, style, className } = this.props;
    return (
      <div style={style} className={className ? className : ''}>
      { !this.state.redirect ?
      <Card className={classes.card}>
        <CardContent>
          <Typography type="display3" component="h2">
            Register
          </Typography>
          <Typography type="headline">
            Sign up for Quizrt - It'll only take a moment...
          </Typography>
          <form className={classes.content} noValidate={true} autoComplete="off">
            <TextField
              id="name"
              label="Full Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              required={true}
            />
            <TextField
              id="email"
              type="email"
              label="Email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              required={true}
            />
            <TextField
              id="password"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.handleConfirm('password')}
              required={true}
            />
            <TextField
              id="passwordConfirm"
              type="password"
              label="Confirm Password"
              error={!this.state.passwordMatch}
              helperText={!this.state.passwordMatch && 'Passwords do not match'}
              onChange={this.handleConfirm('passwordConfirm')}
              required={true}
            />
          </form>
          <Typography style={{marginTop: 15}} type="caption">Already have an account with us?
            Head to our <Link to="/login"> login page </Link>
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            disabled={!this.state.valid}
            dense={true}
            color="primary"
            onClick={this.submit}
          >
          Register
          </Button>
        </CardActions>
      </Card>
      :
      <div>
        <Typography type="display3" color="accent">Registration Successfull!</Typography>
        <Typography type="display2" color="accent">Check your email for a confirmation link</Typography>
      </div>}
      </div>
    );
  }
}

export default registerMutate(decorate<Props>(RegisterComponent));
