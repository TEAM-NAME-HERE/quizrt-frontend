import * as React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import EditAnswerItem from './EditAnswer';
import { CreateQuestionMutation, QuestionScalarFragment,
         UpdateQuestionMutation, DeleteQuestionMutation, QuestionQuery } from '../../graphql/graphql';
import { graphql, compose, ChildProps } from 'react-apollo';
import { areEqualObj, batch, isNewItem, noop } from '../../util';
import { Loading, Error } from '../Messages';

type DeleteCallback = (id: string, success: boolean) => void;

export interface Props {
  question?: string;
  quiz: string;
  onDelete?: DeleteCallback;
  onCreate?: (id: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

interface MutateProps {
  createQuestion: (question: QuestionScalarFragment, quiz: string) => Promise<QuestionScalarFragment>;
  changeQuestion: (question: QuestionScalarFragment) => Promise<QuestionScalarFragment>;
  deleteQuestion: (id: string, callback: DeleteCallback) => Promise<void>;
}

const CREATE_MUTATION = require('../../graphql/mutations/CreateQuestion.graphql');
const createMutation = graphql<CreateQuestionMutation, MutateProps & Props>(CREATE_MUTATION, {
  props: ({ mutate }) => ({
    createQuestion: async (question, quiz) => {
      const results = await mutate!({
        variables: {
          prompt: question.prompt,
          name: question.name,
          order: question.orderNumber,
          duration: question.questionDuration,
          quiz
        },
        optimisticResponse: {
          createQuestion: {
            __typename: 'CreateQuestionPayload',
            question: {
              ...question
            },
            clientMutationId: null
          }
        } as CreateQuestionMutation,
        update: (proxy, passed) => {
          const { data } = passed as { data: CreateQuestionMutation };
          if (data && data.createQuestion && data.createQuestion.question && data.createQuestion.question.id !== '') {
            const newData = {
              question: {
                answerSet: {
                  __typename: 'AnswerNodeConnection',
                  edges: []
                },
                ...data.createQuestion.question
              }
            } as QuestionQuery;
            proxy.writeQuery({ query: QUESTION_QUERY, data: newData, variables: {
               id: data.createQuestion.question.id
             }});
          }
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
          prompt: question.prompt,
          name: question.name,
          order: question.orderNumber,
          duration: question.questionDuration
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
      // if the id is a new item, that means it never
      // got saved, so we don't have to make the network call
      if (isNewItem(id)) {
        cb(id, true);
        return;
      }

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
  skip: (props: Props) => !props.question || isNewItem(props.question),
  options: (props) => ({
    variables: { id: props.question }
  })
});

type AllProps = ChildProps<Props, QuestionQuery> & MutateProps;

interface State {
  question: QuestionScalarFragment;
  answers: string[];
}

const emptyQuestion = {
  id: '',
  prompt: '',
  name: '',
  questionDuration: 30,
  orderNumber: 0,
  __typename: 'QuestionNode'
} as QuestionScalarFragment;

class EditQuestion extends React.Component<AllProps, State> {
  private counter: number;

  constructor(p: Props & MutateProps) {
    super(p);
    this.counter = 0;

    let question = emptyQuestion;
    if (p.question && p.question !== '' && isNewItem(p.question)) {
      question = {...question, orderNumber: Number(p.question.split(':')[1])};
    }

    this.state = { question, answers: [] };
  }

  componentWillReceiveProps(nextProps: AllProps) {
    if (nextProps.data && nextProps.data.question) {
      const data = nextProps.data.question;
      if (!areEqualObj(data, this.state.question)) {
        const answers = data.answerSet
        && data.answerSet.edges.map(e => e && e.node && e.node.id || '');
        this.setState({ question: data, answers: answers || [] });
      }
    }
  }

  createQuestion = async (q: QuestionScalarFragment) => {
    const { createQuestion, quiz } = this.props;
    const data = await createQuestion(q, quiz);
    this.setState({
      question: data
    });
  }

  changeQuestion = async (q: QuestionScalarFragment) => {
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
  saveQuestion = batch(200, (q: QuestionScalarFragment) => {
    const { data, onCreate } = this.props;
    if (data && data.question && areEqualObj(data.question, q)) {
      return new Promise<void>((resolve, _) => resolve());
    }

    if (isNewItem(this.state.question.id)) {
      return this.createQuestion(q).then(() => (onCreate || noop)(this.state.question.id));
    } else {
      return this.changeQuestion(q);
    }
  });

  handleBlur = () => {
    this.saveQuestion(this.state.question);
  }

  handleAnswerDelete = (id: string, success: boolean) => {
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
    } else {
      this.setState({
        answers: this.state.answers.filter(a => a !== id)
      });
    }
  }

  handleAnswerCreate = (oldId: string) => (id: string) => {
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

    // const idx = answers.indexOf(oldId);
    // if (idx >= 0) {
    //   answers.splice(idx, 1, id);
    // }

    // this.setState({
    //   answers
    // });
  }

  addAnswer = () => {
    this.saveQuestion(this.state.question).then(() => {
      const answers = this.state.answers;
      const id = 'new:' + this.counter++;
      this.setState({
        answers: [...answers, id]
      });
    // tslint:disable-next-line:no-console
    }).catch(r => console.log(r));
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
        <CardHeader title={question.name !== '' ? question.name : 'Question'} subheader={question.id} />
        <CardContent>
          <div style={{display: 'flex', flexFlow: 'column nowrap'}}>
          <TextField
            id={`question-${question.id || id}-name`}
            label="Name"
            value={question.name}
            onChange={this.handleChange('name')}
            onBlur={this.handleBlur}
            margin="normal"
          />
          <TextField
            id={`question-${question.id || id}-prompt`}
            label="Prompt"
            multiline={true}
            value={question.prompt}
            onChange={this.handleChange('prompt')}
            onBlur={this.handleBlur}
            margin="normal"
          />
          </div>
          <Typography type="title">Answers</Typography>
          {this.state.answers.map(a => (
            <EditAnswerItem
              key={a}
              answer={a}
              onDelete={this.handleAnswerDelete}
              onCreate={this.handleAnswerCreate(a)}
              question={question.id}
            />
          ))}
          <Button onClick={this.addAnswer}>Add Answer</Button>
        </CardContent>
        <CardActions>
          <Button
            color="contrast"
            onClick={() => deleteQuestion(question.id !== '' ? question.id : String(id), onDelete || noop)}
          > Delete
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default compose(
  withQuestion,
  createMutation,
  updateMutation,
  deleteMutation
)(EditQuestion) as React.ComponentType<Props>;
