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

// tslint:disable-next-line:no-any
const LinkButton: React.SFC<LinkProps & ButtonProps> = p => <Button component={Link as any} {...p} />;

const decorate = withStyles(({ palette, spacing }) => ({
  root: {
    width: '100%'
  },
  flex: {
    flex: 1
  }
}));

const LOGOUT_MUTATION = require('../../graphql/mutations/Logout.graphql');
const logoutMutate = graphql<LogoutUserMutation, Props>(LOGOUT_MUTATION, {});

export interface Props {
  userId: string;
}

type AllProps = WithStyles<'root'>
               & WithStyles<'flex'>
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

  handleLogout = async () => {
    this.handleRequestClose();

    const { mutate } = this.props;

    const result = await mutate!({});

    if (result.data) {
      store.dispatch(setUser(''));
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
                Quizrt
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
                  <MenuItem onClick={this.handleRequestClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleRequestClose}>My Account</MenuItem>
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
export default logoutMutate(decorate<Props>(Header) as any);
