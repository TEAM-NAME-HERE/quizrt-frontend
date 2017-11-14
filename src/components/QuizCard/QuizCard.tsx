import * as React from 'react';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

export interface QuizCardProps {
  // tslint:disable-next-line:no-any
  quiz: {description: string, uuid: string};
  style?: React.CSSProperties;
}
        // <Typography type="display3">
          // Quiz
        // </Typography>

class QuizCard extends React.Component<QuizCardProps> {
  render() {
    const { style } = this.props;
    return (
      <Card style={style ? style : {}} >
        <CardHeader title={`Quiz ${this.props.quiz.uuid}`} />
        <CardContent>
          <Typography type="body1">
            {this.props.quiz.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button>Start</Button>
          <Button>Edit</Button>
        </CardActions>
      </Card>
    );
  }
}

export default QuizCard;
