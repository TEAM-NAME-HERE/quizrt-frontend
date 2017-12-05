import * as user from '../actions/user';

export interface State {
  uuid: string;
  name: string;
  isGuest: boolean;
}

const initialState: State = {
  uuid: '',
  name: '',
  isGuest: false
};

export const reducer = (state = initialState, action: user.Actions): State => {
  switch (action.type) {
    case user.SET_USER:
      return {
        ...state,
        uuid: action.payload.id,
        name: action.payload.name,
        isGuest: false
      };
    case user.SET_GUEST:
      return {
        ...state,
        name: action.payload,
        isGuest: true
      };

    default: return state;
  }
};
