import * as React from 'react';
import { EditQuestionCard, Question } from '../Question';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles, WithStyles } from 'material-ui/styles';
import OverviewSidebar from '../OverviewSidebar/OverviewSidebar';
import Typography from 'material-ui/Typography';

// tslint:disable:no-console
const decorate = withStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  } as React.CSSProperties,
  quizzes: {
    gridColumn: 'left / right',
    ['& > *']: {
      marginBottom: '10px'
    },
    [breakpoints.down('md')]: {
      gridColumn: 'left / end'
    }
  } as React.CSSProperties,
  outerGrid: {
    display: 'grid',
    gridTemplateColumns: '[left] 1fr [middle] 1fr [right] 1fr [end]',
    gridGap: '10px 15px'
  },
  innerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  hideSmall: {
    [breakpoints.down('md')]: {
      display: 'none'
    }
  },
  nameField: {
    gridColumn: '1',
    [breakpoints.down('md')]: {
      gridColumn: '1 / 3'
    }
  },
  sidebar: {
    height: '100vh',
    padding: 10,
    overflow: 'auto'
  } as React.CSSProperties
}));

export interface Quiz {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface EditQuizProps {
  initialQuiz?: Quiz;
  style?: React.CSSProperties;
  className?: string;
  onSave: (q: Quiz) => void;
  onDelete: (q: Quiz) => void;
}

type AllProps = EditQuizProps
              & WithStyles<'container'>
              & WithStyles<'quizzes'>
              & WithStyles<'outerGrid'>
              & WithStyles<'hideSmall'>
              & WithStyles<'nameField'>
              & WithStyles<'sidebar'>
              & WithStyles<'innerGrid'>;

const emptyQuestion = (id: string): Question => ({
  id,
  prompt: '',
  name: '',
  answers: [],
});

class EditQuiz extends React.Component<AllProps, Quiz> {
  static defaultProps = {
    initialQuiz: {
      id: '',
      name: '',
      description: '',
      questions: []
    }
  };

  private counter: number;

  constructor(p: AllProps) {
    super(p);
    this.counter = 0;

    this.state = this.props.initialQuiz as Quiz;
  }

  addQuestion = () => {
    const questions = this.state.questions;
    const id = 'new:' + this.counter++;
    this.setState({
      questions: [...questions, emptyQuestion(id.toString())]
    });
  }

  handleQuestionDelete = (qs: Question) => {
    const questions = this.state.questions.filter(q => q.id !== qs.id);
    this.setState({
      questions
    });
  }

  handleQuestionChange = (qs: Question) => {
    const questions = this.state.questions.map(q => q.id === qs.id ? qs : q);
    this.setState({
      questions
    });
  }

  handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState((s, p) => ({
      ...s,
      [name]: value
    }));
  }

  render() {
    // tslint:disable-next-line:no-any
    const { initialQuiz: { id }} = this.props as any;
    const { style, className, classes, onDelete, onSave } = this.props;
    return (
      <div
        style={style ? style : {}}
        className={`${classes.container} ${className ? className : ''}`}
      >
        <div className={classes.outerGrid} >
          <Typography className={classes.quizzes} type="display1">{this.state.name || 'Quiz'}</Typography>
          <Typography className={classes.hideSmall} style={{gridColumn: 'right'}} type="display1">Overview</Typography>
          <div className={classes.quizzes}>
            <div className={classes.innerGrid} >
              <TextField
                id={`quiz-${id}-name`}
                label="Name"
                value={this.state.name}
                onChange={this.handleChange('name')}
                className={classes.nameField}
                margin="normal"
              />
              <div style={{ gridColumn: '3', justifySelf: 'end' }}>
                <Button onClick={() => onSave(this.state)}>Save</Button>
                <Button
                  onClick={() => {onDelete(this.state); this.setState(EditQuiz.defaultProps.initialQuiz); }}
                >
                  Delete
                </Button>
              </div>
              <TextField
                id={`quiz-${id}-description`}
                label="Description"
                value={this.state.description}
                onChange={this.handleChange('description')}
                multiline={true}
                style={{gridColumn: '1 / 4'}}
                margin="normal"
              />
            </div>
            {this.state.questions.map(q => (
              <EditQuestionCard
                key={q.id}
                initialQuestion={q}
                onDelete={this.handleQuestionDelete}
                onChange={this.handleQuestionChange}
              />
            ))}
            <Button raised={true} onClick={this.addQuestion}>Add Question</Button>
          </div>
          <div className={classes.hideSmall} style={{gridColumn: 'right'}}>
            <OverviewSidebar
              className={classes.sidebar}
              items={this.state.questions}
              onChange={i => this.setState({...this.state, questions: i as Question[]})}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default decorate<EditQuizProps>(EditQuiz);
