import * as React from 'react';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { QuizFragment } from '../../graphql/graphql';

export type QuizAction = (quiz: QuizFragment) => void;

export interface QuizCardProps {
  // tslint:disable-next-line:no-any
  quiz: QuizFragment;
  style?: React.CSSProperties;
  // tslint:disable-next-line:no-any
  onStart?: QuizAction;
  onEdit?: QuizAction;
}
const QuizCard: React.SFC<QuizCardProps> = (props) => {
    const { style } = props;
    const handleOnClick = (f: QuizAction | undefined) => () => {
      if (f && typeof f === 'function') {
        f(props.quiz);
      }
    };
    return (
      <Card style={style ? style : {}} >
        <CardHeader title={`Quiz ${props.quiz.id}`} />
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

export interface QuizListProps {
  className?: string;
  quizzes: QuizFragment[];
  onStart?: QuizAction;
  onEdit?: QuizAction;
}

export const QuizList: React.SFC<QuizListProps> = (props) => {
  const handleOnAction = (f: QuizAction | undefined) => (q: QuizFragment) => {
    if (f && typeof f === 'function') {
      f(q);
    }
  };
  return (
  <div className={props.className ? props.className : ''}>
    {props.quizzes.map(q =>
      <QuizCard
        style={{margin: '20px'}}
        quiz={q}
        key={q.id}
        onEdit={handleOnAction(props.onEdit)}
        onStart={handleOnAction(props.onStart)}
      />)}
  </div>);
};

export default QuizCard;
