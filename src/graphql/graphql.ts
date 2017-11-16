/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type LoginUserMutationVariables = {
  email: string,
  password: string,
};

export type LoginUserMutation = {
  loginUser:  {
    __typename: "LoginUserPayload",
    user:  {
      __typename: "UserNode",
      username: string,
      email: string,
      name: string,
      // The ID of the object.
      id: string,
    },
    clientMutationId: string | null,
  } | null,
};

export type LogoutUserMutation = {
  logoutUser:  {
    __typename: "LogoutUserPayload",
    clientMutationId: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  username: string,
  name: string,
  email: string,
  password: string,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "CreateUserPayload",
    user:  {
      __typename: "UserNode",
      username: string,
      email: string,
      name: string,
      // The ID of the object.
      id: string,
    } | null,
  } | null,
};

export type QuizFragment = {
  __typename: "QuizNode",
  // The ID of the object.
  id: string,
  name: string,
  description: string,
  isPrivate: boolean,
};

export type UserFragment = {
  __typename: "UserNode",
  username: string,
  email: string,
  name: string,
  // The ID of the object.
  id: string,
};
