import * as React from 'react';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { QuizScalarFragment, QuizQuery, QuizQueryVariables,
  CreateSessionMutation, CreateSessionMutationVariables } from '../../graphql/graphql';
import { QueryProps } from 'react-apollo/types';
import { Omit, connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Loading, Error } from '../Messages';
import { State } from '../../reducers';

// tslint:disable-next-line:no-any
export type QuizAction = (quiz: QuizScalarFragment) => Promise<any> | void;

export interface QuizCardComponentProps {
  quiz: QuizScalarFragment;
  style?: React.CSSProperties;
  onStart?: QuizAction;
  onEdit?: QuizAction;
}

export const QuizCardComponent: React.SFC<QuizCardComponentProps> = (props) => {
    const { style } = props;
    const handleOnClick = (f: QuizAction | undefined) => () => {
      if (f && typeof f === 'function') {
        f(props.quiz);
      }
    };
    return (
      <Card style={style ? style : {}} >
        <CardHeader title={props.quiz.name} subheader={props.quiz.id} />
        <CardContent>
          <Typography type="body1">
            {props.quiz.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={handleOnClick(props.onStart)}>Start</Button>
          <Button onClick={handleOnClick(props.onEdit)}>Edit</Button>
        </CardActions>
      </Card>
    );
};

type InputProps = Omit<QuizCardComponentProps, 'onStart'>
  & { onStart?: (session: string) => void }
  & { userId: string };
interface MutateProps {
  createSession: QuizAction;
}

type WrappedChildProps = Omit<InputProps, 'onStart'> & MutateProps;

const CREATE_SESSION_MUTATION = require('../../graphql/mutations/CreateSession.graphql');
const createMutation = graphql<CreateSessionMutation, InputProps, WrappedChildProps>(CREATE_SESSION_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    ...ownProps,
    createSession: (q => {
      return mutate!({
        variables: {
          quiz: ownProps.quiz.id,
          owner: ownProps.userId
        } as CreateSessionMutationVariables
      }).then(s => {
        if (s.data && s.data.createSession && s.data.createSession.session && ownProps.onStart) {
          ownProps.onStart(s.data.createSession.session.id);
        }
      });
    })
  } as Partial<WrappedChildProps>)
});

export type WrappedQuizProps = Omit<QuizCardComponentProps, 'onStart'> & { onStart?: (session: string) => void };

export const WrappedQuiz = connect(
  (state: State) => ({
    userId: state.user.uuid
  })
)(createMutation(({ createSession, ...rest }) => (
  <QuizCardComponent {...rest} onStart={createSession} />
))) as React.ComponentType<WrappedQuizProps>;

export type Props = Omit<WrappedQuizProps, 'quiz'> & { quiz: string };
type WrappedProps = QuizQuery & QueryProps & Omit<Props, 'quiz'>;

const QUIZ_QUERY = require('../../graphql/queries/Quiz.graphql');
const withQuiz = graphql<QuizQuery, Props, WrappedProps>(QUIZ_QUERY, {
  options: ({ quiz }) => ({
    variables: {
      id: quiz
    } as QuizQueryVariables
  }),
  props: ({ ownProps, data }) => ({
    ...ownProps,
    ...data
  })
});

export const Quiz = withQuiz(({ loading, error, quiz, ...rest }) => {
  if (loading) { return <Loading />; }
  if (error) { return <Error error={error} />; }
  if (quiz) {
    return <WrappedQuiz quiz={quiz} {...rest} />;
  } else {
    return <p>No data...</p>;
  }
});

export default Quiz;
