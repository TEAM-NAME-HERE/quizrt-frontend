import * as React from 'react';
import { ResponseFragment, ResponsesQuery } from '../../graphql/graphql';
import { Omit } from 'react-redux';
import { QueryProps } from 'react-apollo/types';
import { graphql } from 'react-apollo';

export interface ResultsComponentProps {
  responses: ResponseFragment[];
}

const ResultsComponent: React.SFC<ResultsComponentProps> = ({ responses }) => {
  const counts = {};

  for (const r  of responses) {
    if (counts[r.answer.description]) {
      counts[r.answer.description]++;
    } else {
      counts[r.answer.description] = 1;
    }
  }

  return (
    <div>
        {
          Object.keys(counts).map(key => (
            <p>
              <strong>
                {counts[key]}
              </strong>
              people answered:
              <pre>
                {key}
              </pre>
            </p>
          ))
        }
    </div>
  )
};

export type Props = Omit<ResultsComponentProps, 'responses'> & { session: string };
type WrappedProps = ResponsesQuery & QueryProps;

const RESULTS_QUERY = require('../../graphql/queries/Responses.graphql');
const withResults = graphql<ResponsesQuery, Props, WrappedProps>(RESULTS_QUERY, {
  props: () => ({

  })
});
