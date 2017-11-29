import * as React from 'react';
import { ProfileWithQuizzesQuery, QuizFragment } from '../../graphql/graphql';
import QuizList from './QuizList';
import { Loading, Error } from '../Display';
import { graphql } from 'react-apollo';

const PROFILE_W_QUIZZES_QUERY = require('../../graphql/queries/ProfileWithQuizzes.graphql');

const withProfile = graphql<ProfileWithQuizzesQuery, {profile: string, className?: string}>(PROFILE_W_QUIZZES_QUERY, {
  options: (props) => ({
    variables: { id: props.profile }
  })
});

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

export default QuizContainer;
