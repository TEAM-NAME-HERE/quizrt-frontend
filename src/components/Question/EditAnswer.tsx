import * as React from 'react';
import Switch from 'material-ui/Switch';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import { CreateAnswerMutation, AnswerFragment,
         UpdateAnswerMutation, DeleteAnswerMutation, AnswerQuery } from '../../graphql/graphql';
import { graphql, compose } from 'react-apollo';
import { ChildProps } from 'react-apollo/types';
import { Loading, Error } from '../Display';

export const emptyAnswer = (id: string): AnswerFragment => ({
  id,
  description: '',
  isCorrect: false,
  __typename: 'AnswerNode'
});

export interface Props {
  answer?: string;
  onDelete: (id: string) => void;
  question: string;
}

interface MutateProps {
  onCreate: (answer: AnswerFragment, question: string) => Promise<AnswerFragment>;
  onChange: (answer: AnswerFragment, question: string) => Promise<AnswerFragment>;
  deleteAnswer: (id: string, callback: ((id: string) => void)) => Promise<void>;
}

const CREATE_MUTATION = require('../../graphql/mutations/CreateAnswer.graphql');
const createMutation = graphql<CreateAnswerMutation, MutateProps & Props>(CREATE_MUTATION, {
  props: ({ mutate }) => ({
    onCreate: async (answer, question) => {
      const results = await mutate!({
        variables: {
          description: answer.description,
          isCorrect: answer.isCorrect,
          question,
        }
      });

      return results.data.createAnswer && results.data.createAnswer.answer;
    }
  } as Partial<MutateProps & Props>)
});

const UPDATE_MUTATION = require('../../graphql/mutations/UpdateAnswer.graphql');
const updateMutation = graphql<UpdateAnswerMutation, MutateProps & Props>(UPDATE_MUTATION, {
  props: ({ mutate }) => ({
    onChange: async (answer, question) => {
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
      await mutate!({
        variables: {
          id
        }
      });

      cb(id);
    }
  } as Partial<MutateProps & Props>)
});

const ANSWER_QUERY = require('../../graphql/queries/Answer.graphql');
const withAnswer = graphql<AnswerQuery, Props>(ANSWER_QUERY, {
  skip: (props: Props) => !props.answer || props.answer === '',
  options: (props) => ({
    variables: { id: props.answer }
  })
});

const compareObj = (a: Object, b: Object) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (const key in a) {
    if (a.hasOwnProperty(key)) {
      if (a[key] !== b[key]) {
        return false;
      }
    }
  }

  return true;
};

type AllProps = ChildProps<Props, AnswerQuery> & MutateProps;
interface State {
  answer: AnswerFragment;
}

class EditAnswerItem extends React.Component<AllProps, State> {
  constructor(p: Props & MutateProps) {
    super(p);
    this.state = {answer: emptyAnswer('')};
  }

  componentWillReceiveProps(nextProps: MutateProps & ChildProps<Props, AnswerQuery>) {
    if (nextProps.data && nextProps.data.answer) {
      const data = nextProps.data.answer;
      let same = compareObj(data, this.state);
      if (!same) {
        this.setState({ answer: data });
      }
    }
  }

  doCreate = async (a: AnswerFragment) => {
    const { onCreate, question } = this.props;
    const data = await onCreate(a, question);
    this.setState({answer: data});
  }

  doChange = async (a: AnswerFragment) => {
    const { onChange, question } = this.props;
    /*const data =*/
    await onChange(a, question);
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

  saveAnswer = (a: AnswerFragment) => {
    if (this.state.answer.id === '') {
      this.doCreate(a);
    } else {
      this.doChange(a);
    }
  }

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
      // tslint:disable-next-line:no-console
      console.log(data, data.error);
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
          id={`answer-${id}-desc`}
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
        <IconButton onClick={() => deleteAnswer(answer.id, onDelete)} aria-label="Delete Answer">
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
