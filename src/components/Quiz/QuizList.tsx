import * as React from 'react';
import { QuizScalarFragment, QuizzesQuery } from '../../graphql/graphql';
import QuizCard, { QuizAction } from './QuizCard';
import Typography from 'material-ui/Typography';
import { Omit } from 'react-redux';
import { graphql } from 'react-apollo';
import { QueryProps } from 'react-apollo/types';
import { Loading, Error } from '../Messages';

export interface QuizListComponentProps {
  className?: string;
  quizzes: QuizScalarFragment[];
  onStart?: QuizAction;
  onEdit?: QuizAction;
}

export const QuizListComponent: React.SFC<QuizListComponentProps> = (props) => {
  const handleOnAction = (f: QuizAction | undefined) => (q: QuizScalarFragment) => {
    if (f && typeof f === 'function') {
      f(q);
    }
  };
  return (
  <div className={props.className ? props.className : ''}>
    {props.quizzes.length === 0 &&
      <Typography type="headline"> No Quizzes... </Typography>
    }
    {props.quizzes.map(q =>
      <QuizCard
        style={{marginBottom: '10px'}}
        quiz={q}
        key={q.id}
        onEdit={handleOnAction(props.onEdit)}
        onStart={handleOnAction(props.onStart)}
      />)}
  </div>);
};

export type Props = Omit<QuizListComponentProps, 'quizzes'> & { profile: string };
type WrappedProps = QuizzesQuery & QueryProps & Omit<Props, 'profile'>;

const QUIZZES_QUERY = require('../../graphql/queries/Quizzes.graphql');
const withQuizzes = graphql<QuizzesQuery, Props, WrappedProps>(QUIZZES_QUERY, {
  options: ({ profile }) => ({
    variables: {
      profile
    }
  }),
  props: ({ data }) => ({
    ...data
  })
});

export default withQuizzes(({ loading, error, quizzes, ...rest }) => {
  if (loading) { return <Loading />; }
  if (error) { return <Error error={error} />; }
  return <QuizListComponent {...rest} quizzes={quizzes!.edges.map(e => e!.node!)} />;
});
