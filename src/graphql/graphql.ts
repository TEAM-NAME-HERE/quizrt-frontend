/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type LoginUserMutationVariables = {
  email: string,
  password: string,
};

export type LoginUserMutation = {
  loginUser:  {
    __typename: "LoginUserPayload",
    uuid: string | null,
    status: number | null,
    user:  {
      __typename: "UserNode",
      uuid: string,
      email: string,
      name: string,
      // The ID of the object.
      id: string,
    } | null,
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
    uuid: string | null,
    user:  {
      __typename: "UserNode",
      uuid: string,
      email: string,
      name: string,
      // The ID of the object.
      id: string,
    } | null,
  } | null,
};

export type UserFragment = {
  __typename: "UserNode",
  uuid: string,
  email: string,
  name: string,
  // The ID of the object.
  id: string,
};
