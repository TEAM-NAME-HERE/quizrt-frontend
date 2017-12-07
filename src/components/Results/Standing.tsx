import * as React from 'react';
import { UserScoresQuery } from '../../graphql/graphql';
import { Typography } from 'material-ui';
import { Omit } from 'react-redux';
import { QueryProps } from 'react-apollo/types';
import { graphql } from 'react-apollo';
import { Loading, Error } from '../Messages';
import { notEmpty, Select } from '../../util';

interface StandingComponentProps {
  users: Select<UserScoresQuery, 'userScores'>;
}

const StandingComponent: React.SFC<StandingComponentProps> = ({ users }) => (
  <div>
    {users.filter(notEmpty).sort((a, b) => b.score - a.score).map((u, id) =>
      <Typography component="p" type="display3" key={id}>
        <strong>{u.username}</strong>: {u.score}
      </Typography>
    )}
  </div>
);

export type Props = Omit<StandingComponentProps, 'users'> & { session: string };
type WrappedProps = UserScoresQuery & QueryProps & Omit<Props, 'session'>;

const USER_SCORES_QUERY = require('../../graphql/queries/UserScores.graphql');
const withUsers = graphql<UserScoresQuery, Props, WrappedProps>(USER_SCORES_QUERY, {
  props: ({ ownProps, data }) => ({
    ...ownProps,
    ...data
  }),
  options: ({ session }) => ({
    variables: {
      session
    }
  })
});

export default withUsers(({ loading, error, userScores, ...rest }) => {
  if (loading) { return <Loading />; }
  if (error) { return <Error error={error} />; }
  if (userScores) {
    return <StandingComponent users={userScores} />;
  } else {
    return <p>No data...</p>;
  }
});
