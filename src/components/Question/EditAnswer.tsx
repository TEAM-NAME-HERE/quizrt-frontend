import * as React from 'react';
import Switch from 'material-ui/Switch';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import { CreateAnswerMutation, AnswerScalarFragment,
         UpdateAnswerMutation, DeleteAnswerMutation, AnswerQuery } from '../../graphql/graphql';
import { graphql, compose } from 'react-apollo';
import { ChildProps } from 'react-apollo/types';
import { Loading, Error } from '../Display';
import { isNewItem, batch, areEqualObj, noop } from '../../util';

const emptyAnswer = (id: string): AnswerScalarFragment => ({
  id,
  description: '',
  isCorrect: false,
  __typename: 'AnswerNode'
});

type DeleteCallback = (id: string, success: boolean) => void;

export interface Props {
  answer?: string;
  onDelete?: DeleteCallback;
  onCreate?: (id: string) => void;
  question: string;
}

interface MutateProps {
  createAnswer: (answer: AnswerScalarFragment, question: string) => Promise<AnswerScalarFragment>;
  changeAnswer: (answer: AnswerScalarFragment, question: string) => Promise<AnswerScalarFragment>;
  deleteAnswer: (id: string, callback: DeleteCallback) => Promise<void>;
}

const CREATE_MUTATION = require('../../graphql/mutations/CreateAnswer.graphql');
const createMutation = graphql<CreateAnswerMutation, MutateProps & Props>(CREATE_MUTATION, {
  props: ({ mutate }) => ({
    createAnswer: async (answer, question) => {
      const results = await mutate!({
        variables: {
          description: answer.description,
          isCorrect: answer.isCorrect,
          question,
        },
        optimisticResponse: {
          createAnswer: {
            __typename: 'CreateAnswerPayload',
            answer: {
              ...answer
            },
            clientMutationId: null
          }
        } as CreateAnswerMutation,
        // caches the request so we don't hit the server when Question updates
        update: (proxy, { data }) => {
          if (data && data.createAnswer && data.createAnswer.answer && data.createAnswer.answer.id !== '') {
            proxy.writeQuery({ query: ANSWER_QUERY, data: data.createAnswer, variables: {
              id: data.createAnswer.answer.id
            }});
          }
        }
      });

      return results.data.createAnswer && results.data.createAnswer.answer;
    }
  } as Partial<MutateProps & Props>)
});

const UPDATE_MUTATION = require('../../graphql/mutations/UpdateAnswer.graphql');
const updateMutation = graphql<UpdateAnswerMutation, MutateProps & Props>(UPDATE_MUTATION, {
  props: ({ mutate }) => ({
    changeAnswer: async (answer, question) => {
      const results = await mutate!({
        variables: {
          id: answer.id,
          description: answer.description,
          isCorrect: answer.isCorrect
        }
      });

      return results.data.updateAnswer && results.data.updateAnswer.answer;
    }
  } as Partial<MutateProps & Props>)
});

const DELETE_MUTATION = require('../../graphql/mutations/DeleteAnswer.graphql');
const deleteMutation = graphql<DeleteAnswerMutation, MutateProps & Props>(DELETE_MUTATION, {
  props: ({ mutate }) => ({
    deleteAnswer: async (id, cb) => {
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

      cb(id, !!(results.data.deleteAnswer && results.data.deleteAnswer.success));
    }
  } as Partial<MutateProps & Props>)
});

const ANSWER_QUERY = require('../../graphql/queries/Answer.graphql');
const withAnswer = graphql<AnswerQuery, Props>(ANSWER_QUERY, {
  skip: (props: Props) => !props.answer || isNewItem(props.answer),
  options: (props) => ({
    variables: { id: props.answer }
  })
});

type AllProps = ChildProps<Props, AnswerQuery> & MutateProps;
interface State {
  answer: AnswerScalarFragment;
}

class EditAnswerItem extends React.Component<AllProps, State> {
  constructor(p: Props & MutateProps) {
    super(p);
    this.state = {answer: emptyAnswer('')};
  }

  componentWillReceiveProps(nextProps: AllProps) {
    if (nextProps.data && nextProps.data.answer) {
      const data = nextProps.data.answer;
      if (!areEqualObj(data, this.state.answer)) {
        this.setState({ answer: data });
      }
    }
  }

  createAnswer = async (a: AnswerScalarFragment) => {
    const { createAnswer, question } = this.props;
    const data = await createAnswer(a, question);
    this.setState({answer: data});
  }

  changeAnswer = async (a: AnswerScalarFragment) => {
    const { changeAnswer, question } = this.props;
    /*const data =*/
    await changeAnswer(a, question);
    // this.setState(data);
  }

  handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({
      answer: {
        ...this.state.answer,
        [name]: value
      }
    });
  }

  // this is batched to prevent double creation errors
  // since the onBlur callback saves the answer, two answers with the
  // same content can be created by hitting the Switch while focus is on the description box
  // tslint:disable-next-line:member-ordering
  saveAnswer = batch(200, (a: AnswerScalarFragment) => {
    const { data, onCreate } = this.props;
    if (data && data.answer && areEqualObj(data.answer, this.state.answer)) {
      return new Promise<void>((_, reject) => reject('No new data'));
    }

    if (isNewItem(this.state.answer.id)) {
      return this.createAnswer(a).then(() => (onCreate || noop)(this.state.answer.id));
    } else {
      return this.changeAnswer(a);
    }
  });

  handleBlur = () => {
    this.saveAnswer(this.state.answer);
  }

  // tslint:disable-next-line:no-any
  handleSwitch = (_: any, c: boolean) => {
    this.setState({
      answer: {
        ...this.state.answer,
        isCorrect: c
      }
    });
    this.saveAnswer({
      ...this.state.answer,
      isCorrect: c
    });
  }

  render() {
    // tslint:disable-next-line:no-any
    const { answer: id, onDelete, deleteAnswer, data } = this.props;
    const { answer } = this.state;
    if (data) {
      if (data.loading) {
        return <Loading />;
      }
      if (data.error) {
        return <Error error={data.error} />;
      }
    }
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <TextField
          id={`answer-${id || answer.id}-desc`}
          label="Description"
          value={answer.description}
          onChange={this.handleChange('description')}
          onBlur={this.handleBlur}
          margin="normal"
        />
        <FormGroup>
          <FormControlLabel
            control={
            <Switch
              checked={answer.isCorrect}
              onChange={this.handleSwitch}
              aria-label="isCorrect"
            />}
            label="Correct"
          />
        </FormGroup>
        <IconButton
          onClick={() => deleteAnswer(answer.id !== '' ? answer.id : String(id), onDelete || noop)}
          aria-label="Delete Answer"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }
}

export default compose(
  withAnswer,
  createMutation,
  updateMutation,
  deleteMutation
)(EditAnswerItem) as React.SFC<Props>;
