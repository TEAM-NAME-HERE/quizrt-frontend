import * as React from 'react';
import { EditQuestion } from '../Question';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles, WithStyles } from 'material-ui/styles';
// import OverviewSidebar from '../OverviewSidebar/OverviewSidebar';
import Typography from 'material-ui/Typography';
import { QuizScalarFragment, CreateQuizMutation, UpdateQuizMutation,
         DeleteQuizMutation, QuizQuery, QuizzesQuery } from '../../graphql/graphql';
import { areEqualObj, isNewItem, batch, noop } from '../../util';
import { graphql, ChildProps, compose } from 'react-apollo';
import { Loading, Error } from '../Messages';
import { Helmet } from 'react-helmet';

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

type DeleteCallback = (id: string, success: boolean) => void;

export interface Props {
  quiz?: string;
  profile: string;
  onCreate?: (id: string) => void;
  onDelete?: DeleteCallback;
  style?: React.CSSProperties;
  className?: string;
}

interface MutateProps {
  createQuiz: (quiz: QuizScalarFragment) => Promise<QuizScalarFragment>;
  changeQuiz: (quiz: QuizScalarFragment) => Promise<QuizScalarFragment>;
  deleteQuiz: (id: string, callback: DeleteCallback) => Promise<void>;
}

const QUIZZES_QUERY = require('../../graphql/queries/Quizzes.graphql');

const CREATE_MUTATION = require('../../graphql/mutations/CreateQuiz.graphql');
const createMutation = graphql<CreateQuizMutation, MutateProps & Props>(CREATE_MUTATION, {
  props: ({ mutate, ownProps }) => ({
    createQuiz: async (quiz ) => {
      const results = await mutate!({
        variables: {
          name: quiz.name,
          description: quiz.description,
          isPrivate: quiz.isPrivate,
          profile: ownProps.profile
        },
        optimisticResponse: {
          createQuiz: {
            __typename: 'CreateQuizPayload',
            quiz: {
              questionSet: {
                edges: []
              },
              ...quiz
            },
            clientMutationId: null
          }
        } as CreateQuizMutation,
        update: (proxy, { data }) => {
          const { createQuiz } = data as CreateQuizMutation;
          if (data && createQuiz && createQuiz.quiz && data.createQuiz.quiz.id !== '') {
            const oldData = proxy.readQuery<QuizzesQuery>({
              query: QUIZZES_QUERY, variables: { profile: ownProps.profile } });
            if (!oldData.quizzes) {
              oldData.quizzes = {
                __typename: 'QuizNodeConnection',
                pageInfo: {
                  __typename: 'PageInfo',
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null
                },
                edges: []
              };
            }
            oldData.quizzes!.edges.push({
              __typename: 'QuizNodeEdge',
              node: createQuiz.quiz,
              cursor: ''
            });
            proxy.writeQuery({ query: QUIZZES_QUERY, variables: { profile: ownProps.profile }, data: oldData });
          }
        }
      });

      return results.data.createQuiz && results.data.createQuiz.quiz;
    }
  } as Partial<MutateProps & Props>)
});

const UPDATE_MUTATION = require('../../graphql/mutations/UpdateQuiz.graphql');
const updateMutation = graphql<UpdateQuizMutation, MutateProps & Props>(UPDATE_MUTATION, {
  props: ({ mutate }) => ({
    changeQuiz: async (quiz) => {
      const results = await mutate!({
        variables: {
          id: quiz.id,
          name: quiz.name,
          description: quiz.description,
          isPrivate: quiz.isPrivate
        },
      });

      return results.data.updateQuiz && results.data.updateQuiz.quiz;
    }
  } as Partial<MutateProps & Props>)
});

const DELETE_MUTATION = require('../../graphql/mutations/DeleteQuiz.graphql');
const deleteMutation = graphql<DeleteQuizMutation, MutateProps & Props>(DELETE_MUTATION, {
  props: ({ mutate, ownProps }) => ({
    deleteQuiz: async (id, cb) => {
      if (isNewItem(id)) {
        cb(id, true);
        return;
      }

      const results = await mutate!({
        variables: {
          id
        },
        update: (proxy, result) => {
          const { data } = result as { data: DeleteQuizMutation };
          if (data.deleteQuiz && data.deleteQuiz.success) {
            const oldData = proxy.readQuery<QuizzesQuery>({
              query: QUIZZES_QUERY, variables: { profile: ownProps.profile }
            });

            if (oldData.quizzes) {
              oldData.quizzes.edges = oldData.quizzes.edges.filter(e => e && e.node && e.node.id !== id);
              proxy.writeQuery({ query: QUIZZES_QUERY, variables: { profile: ownProps.profile }, data: oldData });
            }
          }
        }
      });

      cb(id, !!(results.data.deleteQuiz && results.data.deleteQuiz.success));
    }
  } as Partial<MutateProps & Props>)
});

const QUIZ_QUERY = require('../../graphql/queries/Quiz.graphql');
const withQuiz = graphql<QuizQuery, Props>(QUIZ_QUERY, {
  skip: (props: Props) => !props.quiz || isNewItem(props.quiz),
  options: (props) => ({
    variables: { id: props.quiz }
  })
});

type AllProps = ChildProps<Props, QuizQuery>
              & MutateProps
              & WithStyles<'container'>
              & WithStyles<'quizzes'>
              & WithStyles<'outerGrid'>
              & WithStyles<'hideSmall'>
              & WithStyles<'nameField'>
              & WithStyles<'sidebar'>
              & WithStyles<'innerGrid'>;

interface State {
  quiz: QuizScalarFragment;
  questions: string[];
}

const emptyQuiz = {
  id: '',
  name: '',
  description: '',
  isPrivate: false,
  __typename: 'QuizNode'
} as QuizScalarFragment;

class EditQuiz extends React.Component<AllProps, State> {
  private counter: number;

  constructor(p: AllProps) {
    super(p);
    this.counter = 0;

    this.state = { quiz: emptyQuiz, questions: []};
  }

  componentWillReceiveProps(nextProps: AllProps) {
    if (nextProps.data && nextProps.data.quiz) {
      const data = nextProps.data.quiz;
      if (!areEqualObj(data, this.state.quiz)) {
        const questions = data.questionSet
        && data.questionSet.edges.map(e => e && e.node && e.node.id || '');
        this.setState({ quiz: data, questions: questions || []});
      }
    }
  }

  createQuiz = async (q: QuizScalarFragment) => {
    const { createQuiz } = this.props;
    const data = await createQuiz(q);
    this.setState({
      quiz: data
    });
  }

  changeQuiz = async (q: QuizScalarFragment) => {
    const { changeQuiz } = this.props;
    await changeQuiz(q);
  }

  handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({
      quiz: {
        ...this.state.quiz,
        [name]: value
      }
    });
  }

  // tslint:disable-next-line:member-ordering
  saveQuiz = batch(200, (q: QuizScalarFragment) => {
    const { data, onCreate } = this.props;
    if (data && data.quiz && areEqualObj(data.quiz, q)) {
      return new Promise<void>((resolve, _) => resolve());
    }

    if (isNewItem(this.state.quiz.id)) {
      return this.createQuiz(q).then(() => (onCreate || noop)(this.state.quiz.id));
    } else {
      return this.changeQuiz(q);
    }
  });

  handleBlur = () => {
    this.saveQuiz(this.state.quiz);
  }

  handleQuestionDelete = (id: string, success: boolean) => {
    const { data } = this.props;
    if (data) {
      data.updateQuery((prev: QuizQuery) => {
        const questionSet = prev.quiz && prev.quiz.questionSet;
        const edges = questionSet && questionSet.edges || [];
        return {
          ...prev,
          quiz: {
            ...prev.quiz,
            questionSet: {
              ...questionSet,
              edges: edges.filter(e => e && e.node && e.node.id !== id)
            }
          }
        } as QuizQuery;
      });
    } else {
      this.setState({
        questions: this.state.questions.filter(q => q !== id)
      });
    }
  }

  handleQuestionCreate = (oldId: string) => (id: string) => {
    const { data } = this.props;
    // const { questions } = this.state;
    if (data) {
      data.updateQuery((prev: QuizQuery) => {
        const questionSet = prev.quiz && prev.quiz.questionSet;
        const edges = questionSet && questionSet.edges || [];
        return {
          ...prev,
          quiz: {
            ...prev.quiz,
            questionSet: {
              ...questionSet,
              edges: [...edges, {__typename: 'QuestionNodeEdge', node: { __typename: 'QuestionNode', id}}]
            }
          }
        } as QuizQuery;
      });
    }
    /* This was causing the EditQuestion component to be
       unmounted after creation of a question,
       which caused issues when attempting to add an answer
       as the question was created
       (since we can't modify the state of a component no longer rendered)
       the component appears to still work fine after removal.
       We won't really know until we have some working tests
    */
    // const idx = questions.indexOf(oldId);
    // if (idx >= 0) {
    //   questions.splice(idx, 1, id);
    // }

    // this.setState({
    //   questions
    // });
  }

  doDelete = (id: string, success: boolean) => {
    if (success) {
      this.setState({
        quiz: emptyQuiz,
        questions: []
      });
      (this.props.onDelete || noop)(id, success);
    }
  }

  addQuestion = () => {
    this.saveQuiz(this.state.quiz).then(() => {
      const questions = this.state.questions;
      const id = 'new:' + this.counter++;
      this.setState({
        questions: [...questions, id]
      });
    });
  }

  render() {
    // tslint:disable-next-line:no-any
    const { quiz: id, style, className, classes, deleteQuiz, data } = this.props;
    const { quiz } = this.state;

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
        style={style ? style : {}}
        className={`${classes.container} ${className ? className : ''}`}
      >
        <Helmet>
          <title>Editing {quiz.name}</title>
        </Helmet>
        <div className={classes.outerGrid} >
          <Typography className={classes.quizzes} type="display1">{quiz.name || 'Quiz'}</Typography>
          <Typography className={classes.hideSmall} style={{gridColumn: 'right'}} type="display1">Overview</Typography>
          <div className={classes.quizzes}>
            <div className={classes.innerGrid} >
              <TextField
                id={`quiz-${id || quiz.id}-name`}
                label="Name"
                value={quiz.name}
                onChange={this.handleChange('name')}
                onBlur={this.handleBlur}
                className={classes.nameField}
                margin="normal"
              />
              <div style={{ gridColumn: '3', justifySelf: 'end' }}>
                <Button disabled={areEqualObj(quiz, emptyQuiz)} onClick={() => deleteQuiz(quiz.id, this.doDelete)}>
                  Delete
                </Button>
              </div>
              <TextField
                id={`quiz-${id || quiz.id}-description`}
                label="Description"
                value={quiz.description}
                onChange={this.handleChange('description')}
                onBlur={this.handleBlur}
                multiline={true}
                style={{gridColumn: '1 / 4'}}
                margin="normal"
              />
            </div>
            {this.state.questions.map(q => (
              <EditQuestion
                key={q}
                question={q}
                onDelete={this.handleQuestionDelete}
                onCreate={this.handleQuestionCreate(q)}
                quiz={quiz.id}
              />
            ))}
            <Button raised={true} onClick={this.addQuestion}>Add Question</Button>
          </div>
          <div className={classes.hideSmall} style={{gridColumn: 'right'}}>
            Sidebar
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withQuiz,
  createMutation,
  updateMutation,
  deleteMutation,
  decorate
)(EditQuiz) as React.ComponentType<Props>;
