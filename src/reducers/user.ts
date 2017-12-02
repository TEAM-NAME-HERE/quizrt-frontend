import * as user from '../actions/user';

export interface State {
  uuid: string;
  isGuest: boolean;
}

const initialState: State = {
  uuid: '',
  isGuest: false
};

export const reducer = (state = initialState, action: user.Actions): State => {
  switch (action.type) {
    case user.SET_USER:
      return {
        ...state,
        uuid: action.payload,
        isGuest: false
      };
    case user.SET_GUEST:
      return {
        ...state,
        uuid: action.payload,
        isGuest: true
      };

    default: return state;
  }
};
