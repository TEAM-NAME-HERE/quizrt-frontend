import * as React from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import { QuestionScalarFragment, AnswerScalarFragment, QuestionQuery } from '../../graphql/graphql';
import AnswerList from '../Answer/AnswerList';
import { Omit } from 'react-redux';
import { QueryProps } from 'react-apollo/types';
import { graphql } from 'react-apollo';
import { Loading, Error } from '../Messages';

export interface QuestionCardComponentProps {
  question: QuestionScalarFragment;
  onAnswer?: (answer: AnswerScalarFragment) => void;
  display?: boolean;
  style?: React.CSSProperties;
  className?: string;
  elevation?: number;
}

export const QuestionCardComponent: React.SFC<QuestionCardComponentProps> = (props) => {
  const { question, className, onAnswer, elevation, style, display } = props;

  return (
    <Card elevation={elevation} style={style} className={className ? className : ''}>
      <CardHeader title={props.question.name} subheader={props.question.id} />
      <CardContent>
        <Typography type={display ? 'display2' : 'body1'} component="p">{props.question.prompt}</Typography>
        { !display &&
          <div>
            <Divider />
            <AnswerList question={question.id} onClick={onAnswer} />
          </div>
        }
      </CardContent>
    </Card>
  );
};

export type Props = Omit<QuestionCardComponentProps, 'question'> & { question: string };
type WrappedProps = QuestionQuery & QueryProps & Omit<Props, 'question'>;

const QUESTION_QUERY = require('../../graphql/queries/Question.graphql');
const withQuestion = graphql<QuestionQuery, Props, WrappedProps>(QUESTION_QUERY, {
  options: ({ question }) => ({
    variables: {
      id: question
    }
  }),
  props: ({ ownProps, data }) => ({
    ...ownProps,
    ...data
  })
});

export default withQuestion(({ loading, error, question, ...rest }) => {
  if (loading) { return <Loading />; }
  if (error) { return <Error error={error} />; }
  if (question) {
    return <QuestionCardComponent question={question} {...rest} />;
  } else {
    return <p>No data...</p>;
  }
});
