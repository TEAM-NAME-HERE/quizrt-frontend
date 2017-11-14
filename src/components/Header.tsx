import * as React from 'react';
// import { Link } from 'react-router-dom';
// import { Button } from 'material-ui';
// import { ButtonProps } from 'material-ui/Button';
import { withStyles, WithStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

// const logo = require('./logo.svg');

const decorate = withStyles(({ palette, spacing }) => ({
  root: {
    width: '100%'
  },
  /*
  container: {
    backgroundColor: palette.primary[500],
    display: 'flex',
    flexFlow: 'row nowrap',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as React.CSSProperties,
  */
}));

// const LinkButton: React.SFC<LinkProps & ButtonProps> = p => <Button component={Link} {...p} />;

class Header extends React.Component<WithStyles<'root'>> {
  render() {
    const { classes } = this.props;
    return (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography type="display4">
                Quizirt
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

export default decorate<{}>(Header);
