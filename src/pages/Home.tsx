import * as React from 'react';
import { QuizList } from '../components/QuizCard';
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
import GuestHome from './GuestHome';
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
              & WithStyles<'quizzes'>
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

  render() {
    const { classes } = this.props;
    const { value } = this.state;
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
                <InputLabel htmlFor="profile">Profile</InputLabel>
                <Select
                  value={this.state.profile}
                  onChange={e => this.setState({ ...this.state, profile: e.target.value })}
                  input={<Input id="profile" />}
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
              indicatorColor="accent"
              textColor="accent"
              centered={true}
            >
              <Tab label="Create Quiz" />
              <Tab label="My Quizzes" />
              <Tab label="Join Quiz" />
            </Tabs>
            <div className={classes.tabContainer}>
              {value === 0 && null}
              {value === 1 &&
                <div className={classes.tabContainer}>
                  <QuizContainer profile={this.state.profile} className={classes.quizzes} />
                </div>}
              {value === 2 && null}
            </div>
          </div>
      }
      {!user &&
        <GuestHome />
      }
    </div>
    );
  }
}

export default connect(mapStateToProps)(withUser(decorate<HomeProps>(Home)));
