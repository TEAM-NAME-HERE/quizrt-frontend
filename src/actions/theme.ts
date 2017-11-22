import { ActionCreator } from 'redux';
import { Theme } from 'material-ui/styles';

export const SET_THEME = 'SET_THEME';

type SetUser = {type: string, payload: Theme};

export const setTheme: ActionCreator<SetUser> = (theme: Theme) => ({
  type: SET_THEME,
  payload: theme
});

export type Actions = SetUser;
