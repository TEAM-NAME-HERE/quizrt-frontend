import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import Button, { ButtonProps } from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles, WithStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import { graphql, ChildProps } from 'react-apollo';
import { LogoutUserMutation } from '../../graphql/graphql';
import { store } from '../../App';
import { setUser } from '../../actions/user';
import { USER_ID } from '../../constants';
import { RouteComponentProps, withRouter } from 'react-router';

// tslint:disable-next-line:no-any
const LinkButton: React.SFC<LinkProps & ButtonProps> = p => <Button component={Link as any} {...p} />;

const decorate = withStyles(({ palette, spacing }) => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1
  },
  a: {
    color: 'inherit'
  }
}));

const LOGOUT_MUTATION = require('../../graphql/mutations/Logout.graphql');
const logoutMutate = graphql<LogoutUserMutation, Props>(LOGOUT_MUTATION, {});

export interface Props {
  userId: string;
}

type AllProps = WithStyles<'root'>
               & WithStyles<'flex'>
               & WithStyles<'a'>
               & RouteComponentProps<{}>
               & ChildProps<Props, LogoutUserMutation>;

interface State {
  anchorEl?: HTMLElement;
}

class Header extends React.Component<AllProps, State> {
  constructor(props: AllProps) {
    super(props);
    this.state = {};
  }

  handleMenu = (event: {currentTarget: HTMLElement}) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleJoin = async () => {
    this.handleRequestClose();
    this.props.history.push('/entersession');
  }

  handleLogout = async () => {
    this.handleRequestClose();

    const { mutate } = this.props;

    const result = await mutate!({});

    if (result.data) {
      store.dispatch(setUser(''));
      localStorage.removeItem(USER_ID);
      this.handleRequestClose();
    }
  }

  handleRequestClose = () => {
    this.setState({ anchorEl: undefined });
  }
  render() {
    const { userId, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography className={classes.flex} type="display4">
                <Link className={classes.a} to="/">Quizrt</Link>
              </Typography>
              {userId ?
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="contrast"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onRequestClose={this.handleRequestClose}
                >
                  <MenuItem onClick={this.handleJoin}>Join Quiz</MenuItem>
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
              :
              <LinkButton color="contrast" to="/login">Login</LinkButton>
              }
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

// tslint:disable-next-line:no-any
export default withRouter(logoutMutate(decorate<Props>(Header) as any)) as React.ComponentType<Props>;
