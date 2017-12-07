import { ActionCreator } from 'redux';

export const SET_USER = 'ADD_USER';
export const SET_GUEST = 'ADD_GUEST';

type SetUser = {type: 'ADD_USER', payload: {id: string, name: string}};
type SetGuest = {type: 'ADD_GUEST', payload: string};

export const setUser: ActionCreator<SetUser> = (id: string, name: string) => ({
  type: SET_USER,
  payload: {id, name}
});

export const setGuest: ActionCreator<SetGuest> = (nick: string) => ({
  type: SET_GUEST,
  payload: nick
});

export type Actions = SetUser | SetGuest;
