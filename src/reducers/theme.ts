import * as theme from '../actions/theme';
import { Theme, createMuiTheme } from 'material-ui/styles';

export interface State {
  theme: Theme;
}

const initialState: State = {
  theme: createMuiTheme()
};

export const reducer = (state = initialState, action: theme.Actions): State => {
  switch (action.type) {
    case theme.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };

    default: return state;
  }
};
