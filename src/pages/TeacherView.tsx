import * as React from 'react';
import { graphql, QueryProps, compose } from 'react-apollo';
import Button, { ButtonProps } from 'material-ui/Button';
import { AdvanceQuestionMutation, DisplayResultsMutation,
  AdvanceQuestionMutationVariables, DisplayResultsMutationVariables,
  SessionQuery } from '../graphql/graphql';
import EditQuestion from '../components/Question/EditQuestion';
import Question from '../components/Question/Question';
import { Link, LinkProps } from 'react-router-dom';
import { Typography } from 'material-ui';
import { Omit } from 'react-redux';
import { Loading, Error } from '../components/Messages';

interface Props {
  session: string;
}

interface MutateProps {
  // tslint:disable:no-any
  advanceQuestion: () => Promise<any>;
  displayResults: () => Promise<any>;
  // tslint:enable:no-any
}

const ADVANCE_QUESTION_MUTATION = require('../graphql/mutations/AdvanceQuestion.graphql');
export const advanceMutate = graphql<AdvanceQuestionMutation, MutateProps & Props>(ADVANCE_QUESTION_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    advanceQuestion: async () => {
      return mutate!({
        variables: {
          id: ownProps.session
        } as AdvanceQuestionMutationVariables,
        refetchQueries: [{
          query: SESSION_QUERY,
          variables: { id: ownProps.session }
        }]
      });
    }
  })
});

const DISPLAY_RESULTS_MUTATION = require('../graphql/mutations/DisplayResults.graphql');
export const displayMutate = graphql<DisplayResultsMutation, MutateProps & Props>(DISPLAY_RESULTS_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    displayResults: async () => {
      return mutate!({
        variables: {
          id: ownProps.session
        } as DisplayResultsMutationVariables
      });
    }
  })
});

type TeacherViewComponentProps = {
  session: SessionQuery;
} & MutateProps;

// tslint:disable-next-line:no-any
const LinkButton = (props: LinkProps & ButtonProps) => <Button component={Link as any} {...props} />;

class TeacherViewComponent extends React.Component<TeacherViewComponentProps, { edit: boolean }> {
  constructor(p: TeacherViewComponentProps) {
    super(p);

    this.state = { edit: false };
  }

  render() {
    const { session: { session }, advanceQuestion } = this.props;
    const { edit } = this.state;
    if (session) {
      if (session.isLocked && !session.currentQuestion) {
        return <Typography type="display3">Quiz is over</Typography>;
      }
      if (session.currentQuestion) {
        return (
        <div>
          {edit
          && <div>
              <Button onClick={() => this.setState({ edit: false })}> Save </Button>
              <LinkButton
                to={`/ooglyboogly/${session.currentQuestion.id}/edit`}
              >
                Edit Quiz
              </LinkButton>
              </div>
          || <div>
              <Button onClick={() => this.setState({ edit: true })}> Edit </Button>
              <Button onClick={() => advanceQuestion()}> Next Question </Button>
            </div>}
        {edit && <EditQuestion quiz="" question={session.currentQuestion.id} />
              || <Question display={true} question={session.currentQuestion.id} />}
        </div>
        );
      } else {
        return <Button onClick={() => advanceQuestion()}> Next Question </Button>;
      }
    }
    return <p>No data...</p>;
  }
}

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
    }
  })
});

const Wrapped = compose(advanceMutate, displayMutate, withSession)
(({ loading, error, session, advanceQuestion, displayResults }: WrappedProps) => {
  if (loading) { return <Loading />; }
  if (error) { return <Error error={error} />; }
  if (session) {
    const { currentQuestion, isLocked } = session;
    if (!currentQuestion && isLocked) {
      return <Typography type="display3">Quiz is over</Typography>;
    }
    return (
      <TeacherViewComponent
        session={{ session: session }}
        advanceQuestion={advanceQuestion}
        displayResults={displayResults}
      />
    );
  } else {
    return <p>No data...</p>;
  }
}) as React.ComponentType<Props>;

export default Wrapped;
