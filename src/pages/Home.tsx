import * as React from 'react';
// import { QuizCard } from '../components';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import { withStyles, WithStyles } from 'material-ui/styles';
// tslint:disable:no-any
// tslint:disable:no-console

const quizzes = [
  {description: 'Some Quiz', uuid: '1'},
  {description: 'Another Quiz', uuid: '2'},
  {description: 'Third Quiz', uuid: '3'},
];

const QuizContainer: React.SFC<{className?: string}> = (props) => (
  <div className={props.className ? props.className : ''}>
  {quizzes.map(q => <div key={q.uuid}> haha </div>)}
  </div>
);

const decorate = withStyles(({palette, breakpoints}) => ({
  container: {
    padding: 24,
    backgroundColor: palette.primary[500],
    //               view   header   padding
    minHeight: 'calc(100% - 128px - (24px * 2))',
  } as React.CSSProperties,
  quizzes: {
    width: '100%',
    [breakpoints.up('lg')]: {
      width: '66%'
    }
  } as React.CSSProperties
}));

const sContainer: React.CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
};

export class Home extends React.Component<WithStyles<'container'> & WithStyles<'quizzes'>, {value: number}> {
  state = {
    value: 1
  };

  handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    this.setState({value});
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
    <div className={classes.container}>
      <Typography type="display3"> Welcome, User </Typography>
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
        indicatorColor="accent"
        textColor="accent"
        centered={true}
      >
        <Tab label="Create Quiz" />
        <Tab label="My Quizzes" />
        <Tab label="Join Quiz" />
      </Tabs>
      <div style={sContainer}>
      {value === 0 && null}
      {value === 1 && <QuizContainer className={classes.quizzes} />}
      {value === 2 && null}
      </div>
    </div>
    );
  }
}

export default decorate<{}>(Home);
