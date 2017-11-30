import * as React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import EditAnswerItem from './EditAnswer';
import { CreateQuestionMutation, QuestionFragment,
         UpdateQuestionMutation, DeleteQuestionMutation, QuestionQuery } from '../../graphql/graphql';
import { graphql, compose, ChildProps } from 'react-apollo';
import { areEqualObj, batch, isNewItem } from '../../util';
import { Loading, Error } from '../Display';

export interface Props {
  question?: string;
  quiz: string;
  onDelete: (id: string, success: boolean) => void;
  style?: React.CSSProperties;
  className?: string;
}

interface MutateProps {
  createQuestion: (question: QuestionFragment, quiz: string) => Promise<QuestionFragment>;
  changeQuestion: (question: QuestionFragment) => Promise<QuestionFragment>;
  deleteQuestion: (id: string, callback: ((id: string, success: boolean) => void)) => Promise<void>;
}

const CREATE_MUTATION = require('../../graphql/mutations/CreateQuestion.graphql');
const createMutation = graphql<CreateQuestionMutation, MutateProps & Props>(CREATE_MUTATION, {
  props: ({ mutate }) => ({
    createQuestion: async (question, quiz) => {
      const results = await mutate!({
        variables: {
          prompt: question.prompt,
          quiz
        }
      });

      return results.data.createQuestion && results.data.createQuestion.question;
    }
  } as Partial<MutateProps & Props>)
});

const UPDATE_MUTATION = require('../../graphql/mutations/UpdateQuestion.graphql');
const updateMutation = graphql<UpdateQuestionMutation, MutateProps & Props>(UPDATE_MUTATION, {
  props: ({ mutate }) => ({
    changeQuestion: async (question) => {
      const results = await mutate!({
        variables: {
          id: question.id,
          prompt: question.prompt
        }
      });

      return results.data.updateQuestion && results.data.updateQuestion.question;
    }
  } as Partial<MutateProps & Props>)
});

const DELETE_MUTATION = require('../../graphql/mutations/DeleteQuestion.graphql');
const deleteMutation = graphql<DeleteQuestionMutation, MutateProps & Props>(DELETE_MUTATION, {
  props: ({ mutate }) => ({
    deleteQuestion: async (id, cb) => {
      const results = await mutate!({
        variables: {
          id
        }
      });

      cb(id, !!(results.data.deleteQuestion && results.data.deleteQuestion.success));
    }
  } as Partial<MutateProps & Props>)
});

const QUESTION_QUERY = require('../../graphql/queries/Question.graphql');
const withQuestion = graphql<QuestionQuery, Props>(QUESTION_QUERY, {
  skip: (props: Props) => !props.question || props.question === '' || props.question.indexOf('new:') >= 0,
  options: (props) => ({
    variables: { id: props.question }
  })
});

type AllProps = ChildProps<Props, QuestionQuery> & MutateProps;

interface State {
  question: QuestionFragment;
  answers: string[];
}

const emptyQuestion = {
  id: '',
  prompt: '',
  __typename: 'QuestionNode'
} as QuestionFragment;

class EditQuestionCard extends React.Component<AllProps, State> {
  private counter: number;

  constructor(p: Props & MutateProps) {
    super(p);
    this.counter = 0;

    this.state = { question: emptyQuestion, answers: [] };
  }

  componentWillReceiveProps(nextProps: AllProps) {
    if (nextProps.data && nextProps.data.question) {
      const data = nextProps.data.question;
      const same = areEqualObj(data, this.state.question);
      if (!same) {
        const answers = data.answerSet
        && data.answerSet.edges.map(e => e && e.node && e.node.id || '');
        this.setState({ question: data, answers: answers || [] });
      }
    }
  }

  createQuestion = async (q: QuestionFragment) => {
    const { createQuestion, quiz } = this.props;
    const data = await createQuestion(q, quiz);
    this.setState({
      question: data
    });
  }

  changeQuestion = async (q: QuestionFragment) => {
    const { changeQuestion } = this.props;
    await changeQuestion(q);
  }

  handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({
      question: {
        ...this.state.question,
        [name]: value
      }
    });
  }

  // tslint:disable-next-line:member-ordering
  saveQuestion = batch(200, (q: QuestionFragment) => {
    const { data } = this.props;
    if (data && data.question && areEqualObj(data.question, q)) {
      return;
    }

    if (isNewItem(this.state.question.id)) {
      this.createQuestion(q);
    } else {
      this.changeQuestion(q);
    }
  });

  handleBlur = () => {
    this.saveQuestion(this.state.question);
  }

  handleAnswerDelete = (id: string) => {
    const { data } = this.props;
    if (data) {
      data.updateQuery((prev: QuestionQuery) => {
        const answerSet = prev.question && prev.question.answerSet;
        const edges = answerSet && answerSet.edges || [];
        return {
          ...prev,
          question: {
            ...prev.question,
            answerSet: {
              ...answerSet,
              edges: edges.filter(e => e && e.node && e.node.id !== id)
            }
          }
        };
      });
    }
  }

  handleAnswerCreate = (id: string) => {
    const { data } = this.props;
    if (data) {
      data.updateQuery((prev: QuestionQuery) => {
        const answerSet = prev.question && prev.question.answerSet;
        const edges = answerSet && answerSet.edges || [];
        return {
          ...prev,
          question: {
            ...prev.question,
            answerSet: {
              ...answerSet,
              edges: [...edges, {__typename: 'AnswerNodeEdge', node: { __typename: 'AnswerNode', id}}]
            }
          }
        };
      });
    }
  }

  addAnswer = () => {
    this.saveQuestion(this.state.question);
    const answers = this.state.answers;
    const id = 'new:' + this.counter++;
    this.setState({
      answers: [...answers, id]
    });
  }

  render() {
    const { question: id, style, deleteQuestion, onDelete, data } = this.props;
    const { question } = this.state;

    if (data) {
      if (data.loading) {
        return <Loading />;
      }
      if (data.error) {
        return <Error error={data.error} />;
      }
    }

    return (
      <Card style={style ? style : {width: '100%'}}>
        <CardHeader title={`Question ${id || question.id}`} />
        <CardContent>
          <TextField
            id={`question-${id || question.id}-prompt`}
            label="Prompt"
            multiline={true}
            value={question.prompt}
            onChange={this.handleChange('prompt')}
            onBlur={this.handleBlur}
            margin="normal"
          />
          <Typography type="title">Answers</Typography>
          {this.state.answers.map(a => (
            <EditAnswerItem
              key={a}
              answer={a}
              onDelete={this.handleAnswerDelete}
              onCreate={this.handleAnswerCreate}
              question={question.id}
            />
          ))}
          <Button onClick={this.addAnswer}>Add Answer</Button>
        </CardContent>
        <CardActions>
          <Button
            color="contrast"
            onClick={() => deleteQuestion(question.id, onDelete)}
          > Delete
          </Button>
        </CardActions>
      </Card>
    );
  }
}

const EditQuestion: React.SFC<Props> = compose(
  withQuestion,
  createMutation,
  updateMutation,
  deleteMutation
)(EditQuestionCard);

export default EditQuestion;
