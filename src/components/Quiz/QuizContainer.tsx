import * as React from 'react';
import { ProfileWithQuizzesQuery, QuizScalarFragment } from '../../graphql/graphql';
import QuizList from './QuizList';
import { Loading, Error } from '../Messages';
import { graphql } from 'react-apollo';
import { ChildProps } from 'react-apollo/types';
import { Redirect } from 'react-router';

const PROFILE_W_QUIZZES_QUERY = require('../../graphql/queries/ProfileWithQuizzes.graphql');

export interface Props {
  profile: string;
  className?: string;
}

const withProfile = graphql<ProfileWithQuizzesQuery, Props>(PROFILE_W_QUIZZES_QUERY, {
  options: (props) => ({
    variables: { id: props.profile }
  })
});

type AllProps = ChildProps<Props, ProfileWithQuizzesQuery>;

class QuizContainer extends React.Component<AllProps, { edit: string }> {
  constructor(p: AllProps) {
    super(p);
    this.state = { edit: '' };
  }

  render() {
    const { data, className } = this.props;
    const { edit } = this.state;
    if (data) {
      if (data.loading) { return <Loading />; }
      if (data.error) { return <Error error={data.error} />; }
      if (data.profile && data.profile.quizSet) {
        const quizzes = data.profile.quizSet.edges.map(
          e => e && e.node
        );
        if (edit !== '') {
          return <Redirect to={`/${data.profile.id}/${edit}/edit`} push={true} />;
        }
        return (
          <QuizList
            className={className}
            quizzes={quizzes as QuizScalarFragment[]}
            onEdit={q => this.setState({edit: q.id})}
          />);
      }
    }
    return <div>No Data</div>;
  }
}

export default withProfile(QuizContainer) as React.ComponentType<Props>;
