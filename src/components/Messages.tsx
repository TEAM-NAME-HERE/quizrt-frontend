import * as React from 'react';
import Typography from 'material-ui/Typography';

export const Loading = () => <Typography type="headline">Loading...</Typography>;

// tslint:disable-next-line:no-any
export const Error: React.SFC<{error: any}> = ({error}) => (
  <div>
    <Typography type="headline">Error</Typography>
    <pre>{JSON.stringify(error, null, 4)}</pre>
  </div>);
