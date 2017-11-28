import * as user from '../actions/user';

export interface State {
  uuid: string;
}

const initialState: State = {
  uuid: ''
};

export const reducer = (state = initialState, action: user.Actions): State => {
  switch (action.type) {
    case user.SET_USER:
      return {
        ...state,
        uuid: action.payload
      };

    default: return state;
  }
};
