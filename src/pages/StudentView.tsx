import * as React from 'react';
import Question from '../components/Question/Question';
import Typography from 'material-ui/Typography';
import { graphql } from 'react-apollo';
import { CreateResponseMutation, SessionQuery } from '../graphql/graphql';
import { QueryProps } from 'react-apollo/types';
import { Loading, Error } from '../components/Messages';
import { ApolloQueryResult } from 'apollo-client';
import { Omit } from 'react-redux';
import { store } from '../App';

interface StudentViewComponentProps {
  currentQuestion?: string;
  // tslint:disable-next-line:no-any
  submitAnswer?: (id: string) => Promise<any>;
}

class StudentViewComponent extends React.Component<StudentViewComponentProps, { answered: boolean}> {
  constructor(p: StudentViewComponentProps) {
    super(p);
    this.state = {answered: false};
  }

  componentWillReceiveProps() {
    this.setState({ answered: false });
  }

  answer = (id: string) => {
    const { submitAnswer } = this.props;
    if (submitAnswer) {
      submitAnswer(id).then(() => this.setState({ answered: true }));
    }
  }

  render() {
    const { currentQuestion } = this.props;
    const { answered } = this.state;
    if (currentQuestion && currentQuestion !== '') {
      if (answered) {
        return <Typography type="display3">Question has been answered</Typography>;
      }
      return <Question question={currentQuestion} onAnswer={a => this.answer(a.id)} />;
    } else {
      return <Typography type="display3">Waiting for question</Typography>;
    }
  }
}

interface MutateProps {
  submitAnswer: (id: string, delay: number, user: string) => Promise<ApolloQueryResult<CreateResponseMutation>>;
}

export interface Props {
  session: string;
}

const CREATE_RESPONSE_MUTATION = require('../graphql/mutations/CreateResponse.graphql');
export const responseMutate =
graphql<CreateResponseMutation, Props, MutateProps & Props>(CREATE_RESPONSE_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    ...ownProps,
    submitAnswer: (id, delay, user) => {
      return mutate!({
        variables: {
          session: ownProps.session,
          user,
          delay,
          answer: id,
        }
      });
    }
  } as MutateProps)
});

type WrappedProps = SessionQuery & QueryProps & Omit<Props, 'session'> & MutateProps;

const SESSION_QUERY = require('../graphql/queries/Session.graphql');
const withSession = graphql<SessionQuery, Props & MutateProps, WrappedProps>(SESSION_QUERY, {
  props: ({ ownProps, data }) => ({
    ...ownProps,
    ...data
  }),
  options: ({ session }) => ({
    variables: {
      id: session
    },
    pollInterval: 1000
  })
});

const Wrapped = withSession(({ loading, error, session, submitAnswer }) => {
  const time = Date.now();
  const user = store.getState().user.name;
  if (loading) { return <Loading />; }
  if (error) { return <Error error={error} />; }
  if (session) {
    const { currentQuestion, displayResults, isLocked } = session;
    if (!currentQuestion && isLocked) {
      return <Typography type="display3">Quiz is over</Typography>;
    }
    return (
    <StudentViewComponent
      currentQuestion={currentQuestion && !displayResults ? currentQuestion.id : ''}
      submitAnswer={id => submitAnswer(id, Date.now() - time, user)}
    />);
  } else {
    return <p>No data...</p>;
  }
});

export default responseMutate(({ session, submitAnswer }) => <Wrapped session={session} submitAnswer={submitAnswer} />);
