import { ActionCreator } from 'redux';

export const SET_USER = 'ADD_USER';

type SetUser = {type: string, payload: string};

export const setUser: ActionCreator<SetUser> = (id: string) => ({
  type: SET_USER,
  payload: id
});

export type Actions = SetUser;
