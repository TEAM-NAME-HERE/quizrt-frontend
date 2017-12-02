import { ActionCreator } from 'redux';

export const SET_USER = 'ADD_USER';
export const SET_GUEST = 'ADD_GUEST';

type SetUser = {type: string, payload: string};

export const setUser: ActionCreator<SetUser> = (id: string) => ({
  type: SET_USER,
  payload: id
});

export const setGuest: ActionCreator<SetUser> = (nick: string) => ({
  type: SET_GUEST,
  payload: nick
});

export type Actions = SetUser;
