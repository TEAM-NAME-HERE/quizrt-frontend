import * as React from 'react';
import Typography from 'material-ui/Typography';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { noop } from '../../util';
import { withRouter } from 'react-router-dom';

export interface EnterSessionCardProps {
  style?: React.CSSProperties;
  className?: string;
  elevation?: number;
  onSubmit?: (pin: string) => void;
}

export class EnterSessionCard extends React.Component<EnterSessionCardProps, { pin: string; }> {
  constructor(p: EnterSessionCardProps) {
    super(p);
    this.state = { pin: '' };
  }

  // tslint:disable:no-console
  render() {
    const { style, className, onSubmit, ...rest } = this.props;
    return (
      <Card
        title="PIN Input"
        style={style ? style : {}}
        className={className ? className : ''}
        {...rest}
      >
        <CardContent>
          <Typography type="display3" component="h2">
            Enter Your Desired Quiz's PIN
          </Typography>
          <TextField
            id="pin-input"
            label="PIN"
            value={this.state.pin}
            onChange={e => this.setState({ pin: e.target.value })}
            required={true}
          />
        </CardContent>
        <CardActions>
          <Button dense={true} color="primary" onClick={() => (onSubmit || noop)(this.state.pin)}>
            Join
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

const EnterSession = withRouter((props) => {
  const { match, location, history,
          staticContext, ...rest } = props;
  return (
    <EnterSessionCard
      {...rest}
      onSubmit={async n => {
        history.push(`/session/${n}/student`);
      }}
    />
  );
});

export default EnterSession as React.ComponentType<Props>;
