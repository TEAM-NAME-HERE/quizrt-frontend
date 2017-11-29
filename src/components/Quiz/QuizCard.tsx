import * as React from 'react';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { QuizFragment } from '../../graphql/graphql';

export type QuizAction = (quiz: QuizFragment) => void;

export interface Props {
  // tslint:disable-next-line:no-any
  quiz: QuizFragment;
  style?: React.CSSProperties;
  // tslint:disable-next-line:no-any
  onStart?: QuizAction;
  onEdit?: QuizAction;
}
const QuizCard: React.SFC<Props> = (props) => {
    const { style } = props;
    const handleOnClick = (f: QuizAction | undefined) => () => {
      if (f && typeof f === 'function') {
        f(props.quiz);
      }
    };
    return (
      <Card style={style ? style : {}} >
        <CardHeader title={`${props.quiz.name}`} />
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

export default QuizCard;
