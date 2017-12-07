import * as React from 'react';
import { QuizScalarFragment, QuizzesQuery } from '../../graphql/graphql';
import { WrappedQuiz, QuizAction } from './Quiz';
import Typography from 'material-ui/Typography';
import { Omit } from 'react-redux';
import { graphql } from 'react-apollo';
import { QueryProps } from 'react-apollo/types';
import { Loading, Error } from '../Messages';

export interface QuizListComponentProps {
  className?: string;
  quizzes: QuizScalarFragment[];
  onStart?: (session: string) => void;
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
      <WrappedQuiz
        style={{marginBottom: '10px'}}
        quiz={q}
        key={q.id}
        onEdit={handleOnAction(props.onEdit)}
        onStart={s => props.onStart && props.onStart(s)}
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
