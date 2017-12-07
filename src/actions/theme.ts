import { ActionCreator } from 'redux';
import { Theme } from 'material-ui/styles';

export const SET_THEME = 'SET_THEME';

type SetTheme = {type: string, payload: Theme};

export const setTheme: ActionCreator<SetTheme> = (theme: Theme) => ({
  type: SET_THEME,
  payload: theme
});

export type Actions = SetTheme;
