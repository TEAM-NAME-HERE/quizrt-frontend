import * as React from 'react';
import { QuizFragment } from '../../graphql/graphql';
import QuizCard, { QuizAction } from './QuizCard';
import Typography from 'material-ui/Typography';

export interface Props {
  className?: string;
  quizzes: QuizFragment[];
  onStart?: QuizAction;
  onEdit?: QuizAction;
}

const QuizList: React.SFC<Props> = (props) => {
  const handleOnAction = (f: QuizAction | undefined) => (q: QuizFragment) => {
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

export default QuizList;
