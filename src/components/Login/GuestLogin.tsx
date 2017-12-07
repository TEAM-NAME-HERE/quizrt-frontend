import * as React from 'react';
import Typography from 'material-ui/Typography';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { noop } from '../../util';
import { withRouter } from 'react-router-dom';
import { setGuest } from '../../actions/user';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

export interface GuestLoginCardProps {
  style?: React.CSSProperties;
  className?: string;
  elevation?: number;
  onSubmit?: (name: string) => void;
}

export class GuestLoginCard extends React.Component<GuestLoginCardProps, { name: string; }> {
  constructor(p: GuestLoginCardProps) {
    super(p);
    this.state = { name: '' };
  }

  // tslint:disable:no-console
  render() {
    const { style, className, onSubmit, ...rest } = this.props;
    return (
      <Card
        title="Continue as guest"
        style={style ? style : {}}
        className={className ? className : ''}
        {...rest}
      >
        <CardContent>
          <Typography type="display3" component="h2">
            Guest Login
          </Typography>
          <TextField
            id="guest-input-name"
            label="Nickname"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            required={true}
          />
        </CardContent>
        <CardActions>
          <Button dense={true} color="primary" onClick={() => (onSubmit || noop)(this.state.name)}>
            Continue
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export interface Props {
  style?: React.CSSProperties;
  className?: string;
  elevation?: number;
}

const GuestLogin = withRouter(connect(null, (d) =>
  ({ saveUser: async (n: string) => d(setGuest(n)) })
)((props) => {
  const { match, location, history,
          staticContext, saveUser, ...rest } = props as (typeof props) & RouteComponentProps<{}>;
  return (
    <GuestLoginCard
      {...rest}
      onSubmit={async n => {
        await saveUser(n);
        history.replace('/entersession');
      }}
    />
  );
}));

export default GuestLogin as React.ComponentType<Props>;
