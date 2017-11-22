import * as React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import EditAnswerItem, { Answer, emptyAnswer } from './EditAnswer';

export interface Question {
  id: string;
  name: string;
  prompt: string;
  answers: Answer[];
  order?: number;
}

export interface Props {
  initialQuestion?: Question;
  onChange: (question: Question) => void;
  onDelete: (question: Question) => void;
  style?: React.CSSProperties;
  className?: string;
}

class EditQuestionCard extends React.Component<Props, Question> {
  static defaultProps = {
    initialQuestion: {
      id: '',
      prompt: '',
      answers: []
    }
  };
  private counter: number;

  constructor(p: Props) {
    super(p);
    this.counter = 0;

    this.state = p.initialQuestion as Question;
  }

  handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.props.onChange({
      ...this.state,
      [name]: value
    });
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  handleAnswerChange = (answer: Answer) => {
    const answers = this.state.answers.map(a => a.id === answer.id ? answer : a);
    this.props.onChange({
      ...this.state,
      answers
    });
    this.setState({
      answers
    });
  }

  handleAnswerDelete = (answer: Answer) => {
    const answers = this.state.answers.filter(a => a.id !== answer.id);
    this.props.onChange({
      ...this.state,
      answers
    });
    this.setState({
      answers
    });
  }

  addAnswer = () => {
    const answers = this.state.answers;
    const id = 'new:' + this.counter++;
    this.setState({
      answers: [...answers, emptyAnswer(id.toString())]
    });
  }

  render() {
    const { style, onDelete } = this.props;
    // tslint:disable-next-line:no-any
    const { initialQuestion: { id } } = this.props as any;
    return (
      <Card style={style ? style : {width: '100%'}}>
        <CardHeader title={`Question ${id}`} />
        <CardContent>
          <TextField
            id={`question-${id}-prompt`}
            label="Prompt"
            multiline={true}
            value={this.state.prompt}
            onChange={this.handleChange('prompt')}
            margin="normal"
          />
          <Typography type="title">Answers</Typography>
          {this.state.answers.map(a => (
            <EditAnswerItem
              key={a.id}
              initialAnswer={a}
              onChange={this.handleAnswerChange}
              onDelete={this.handleAnswerDelete}
            />
          ))}
          <Button onClick={this.addAnswer}>Add Answer</Button>
        </CardContent>
        <CardActions>
          <Button color="contrast" onClick={() => onDelete(this.state)}>Delete</Button>
        </CardActions>
      </Card>
    );
  }
}

export default EditQuestionCard;
