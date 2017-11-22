import * as React from 'react';
import { QuizList, EditQuiz } from '../components/Quiz';
import Tabs, { Tab } from 'material-ui/Tabs';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import { withStyles, WithStyles } from 'material-ui/styles';
import { ProfileWithQuizzesQuery, UserWithProfilesQuery, QuizFragment } from '../graphql/graphql';
import { graphql, ChildProps } from 'react-apollo';
import { State } from '../reducers/index';
import { connect } from 'react-redux';
import { setTheme } from '../actions/theme';
import { greenTheme } from '../components/styles/theme';
import { store } from '../App';
// tslint:disable:no-any
// tslint:disable:no-console

const PROFILE_W_QUIZZES_QUERY = require('../graphql/queries/ProfileWithQuizzes.graphql');

const withProfile = graphql<ProfileWithQuizzesQuery, {profile: string, className?: string}>(PROFILE_W_QUIZZES_QUERY, {
  options: (props) => ({
    variables: { id: props.profile }
  })
});

const Loading = () => <Typography type="headline">Loading...</Typography>;
const Error: React.SFC<{error: any}> = ({error}) => (
  <div>
    <Typography type="headline">Error</Typography>
    <pre>{JSON.stringify(error)}</pre>
  </div>);

const QuizContainer = withProfile(({ data, className }) => {
  if (data) {
    if (data.loading) { return <Loading />; }
    if (data.error) { return <Error error={data.error} />; }
    if (data.profile && data.profile.quizSet) {
      const quizzes = data.profile.quizSet.edges.map(
        e => e && e.node
      );
      return <QuizList className={className} quizzes={quizzes as QuizFragment[]} />;
    }
  }
  return <div>No Data</div>;
});

const decorate = withStyles(({palette, breakpoints}) => ({
  container: {
  } as React.CSSProperties,
  main: {
    width: '100%',
    [breakpoints.up('lg')]: {
      width: '66%'
    }
  } as React.CSSProperties,
  tabContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '10px'
  } as React.CSSProperties
}));

const USER_WITH_PROFILES_QUERY = require('../graphql/queries/UserWithProfiles.graphql');

const mapStateToProps = (state: State) => ({
  userId: state.user.uuid
});

export interface HomeProps {
  userId: string;
}

const withUser = graphql<UserWithProfilesQuery, HomeProps>(USER_WITH_PROFILES_QUERY, {
  options: ({ userId }) => ({
    variables: { id: userId }
  })
});

type AllProps = WithStyles<'container'>
              & WithStyles<'main'>
              & WithStyles<'tabContainer'>
              & ChildProps<HomeProps, UserWithProfilesQuery>;

interface HomeState {
  value: number;
  profile: string;
}

class Home extends React.Component<AllProps, HomeState> {
  constructor(props: AllProps) {
    super(props);
    this.state = {
      value: 1,
      profile: ''
    };
  }

  componentDidUpdate() {
    const data = this.props.data;
    const user = data && data.user;
    if (user && user.classProfiles && user.classProfiles.edges) {
      const first = user.classProfiles.edges[0];
      const firstId = first && first.node && first.node.id;
      if (firstId && this.state.profile === '') {
        this.setState({
          ...this.state,
          profile: firstId
        });
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    store.dispatch(setTheme(greenTheme));
    const data = this.props.data;
    const error = data && data.error;
    const loading = data && data.loading;
    const user = data && data.user;
    return (
    <div className={classes.container}>
      {loading && <Loading />}
      {error && <Error error={error} />}
      {user &&
          <div className={classes.container}>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Typography type="display3"> Welcome, {user && user.name} </Typography>
              <FormControl style={{minWidth: '100px'}}>
                <InputLabel htmlFor="class">Class</InputLabel>
                <Select
                  value={this.state.profile}
                  onChange={e => this.setState({ ...this.state, profile: e.target.value })}
                  input={<Input id="class" />}
                >
                  {user && user.classProfiles && user.classProfiles.edges.map(
                    e => e && e.node && (
                      <MenuItem key={e.node.id} value={e.node.id}>{e.node.name}</MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
            <Tabs
              value={this.state.value}
              onChange={(e, v) => this.setState({ ...this.state, value: v })}
              indicatorColor="primary"
              textColor="primary"
              centered={true}
            >
              <Tab label="Create Quiz" />
              <Tab label="My Quizzes" />
              <Tab label="Join Quiz" />
            </Tabs>
            <div className={classes.tabContainer}>
              {value === 0 &&
                <EditQuiz
                  className={classes.main}
                  onSave={q => console.log(q)}
                  onDelete={q => console.log(q)}
                />
              }
              {value === 1 &&
                <div className={classes.tabContainer}>
                  <QuizContainer profile={this.state.profile} className={classes.main} />
                </div>}
              {value === 2 && null}
            </div>
          </div>
      }
    </div>
    );
  }
}

export default connect(mapStateToProps)(withUser(decorate<HomeProps>(Home)));
