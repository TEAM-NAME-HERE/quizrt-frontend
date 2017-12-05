import * as React from 'react';
import { UserQuery, UserQueryVariables } from '../../graphql/graphql';
import { QueryProps } from 'react-apollo/types';
import { graphql } from 'react-apollo';
import { USER_ID } from '../../constants';
import { connect } from 'react-redux';
import { Select } from '../../util';
import { setUser } from '../../actions/user';

interface Props {
  user: string;
}

type WrappedProps = UserQuery & QueryProps;

const USER_QUERY = require('../../graphql/queries/User.graphql');
const withUser = graphql<UserQuery, Props, WrappedProps>(USER_QUERY, {
  skip: ({ user }) => !user || user === '',
  props: ({ data }) => ({
    ...data
  }),
  options: ({ user }) => ({
    variables: {
      user
    } as UserQueryVariables
  })
});

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: any, ownProps: WrappedProps) => ({
  ...ownProps,
  saveUser: (user: Select<UserQuery, 'user'>) =>
    user && dispatch(setUser(user.id, user.name))
});

export const SetUser = withUser((
  connect( null, mapDispatchToProps)(({ loading, user, error, saveUser }) => {
  if (user) {
    localStorage.setItem(USER_ID, user.id);
    saveUser(user);
  }
  return <div />;
})));

export default SetUser;
