import * as React from 'react';
import { AnswerScalarFragment, AnswersQuery } from '../../graphql/graphql';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { graphql } from 'react-apollo';
import { Omit } from 'react-redux';
import { QueryProps } from 'react-apollo/types';
import { Loading, Error } from '../Messages';

export interface AnswerListComponentProps {
  answers: AnswerScalarFragment[];
  filterIncorrect?: boolean;
  onClick?: (answer: AnswerScalarFragment) => void;
}

export const AnswerListComponent: React.SFC<AnswerListComponentProps> = ({ answers, onClick, filterIncorrect }) => {
  return (
    <List>
      {answers.filter(a => a.isCorrect || !filterIncorrect).map(a => (
        <ListItem button={true} onClick={() => onClick && onClick(a)}>
          <ListItemText primary={a.description} />
        </ListItem>
      ))}
    </List>
  );
};

export type Props = Omit<AnswerListComponentProps, 'answers'> & { question: string };
type WrappedProps = AnswersQuery & QueryProps & Omit<Props, 'question'>;

const ANSWERS_QUERY = require('../../graphql/queries/Answers.graphql');
const withAnswers = graphql<AnswersQuery, Props, WrappedProps>(ANSWERS_QUERY, {
  props: ({ ownProps, data }) => ({
    ...ownProps,
    ...data
  }),
  options: ({ question })  => ({
    variables: {
      question
    }
  })
});

export default withAnswers(({ loading, answers, error, onClick }) => {
  if (loading) { return <Loading />; }
  if (error) { return <Error error={error} />; }
  if (answers) {
    const filtered = answers.edges.filter(e => e && e.node).map(e => e!.node);
    return <AnswerListComponent onClick={onClick} answers={filtered as AnswerScalarFragment[]} />;
  } else {
    return <p>No data...</p>;
  }
});
