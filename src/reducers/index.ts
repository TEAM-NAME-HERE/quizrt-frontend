import * as user from './user';
import * as theme from './theme';
import { combineReducers, Action } from 'redux';

export interface ActionReducer<T, V extends Action = Action> {
  (state: T | undefined, action: V): T;
}

export type ActionReducerMap<T, V extends Action = Action> = {
  [p in keyof T]: ActionReducer<T[p], V>
};

export interface State {
  user: user.State;
  theme: theme.State;
}

const reducers: ActionReducerMap<State> = {
  user: user.reducer,
  theme: theme.reducer
};

export default combineReducers<State>(reducers);
