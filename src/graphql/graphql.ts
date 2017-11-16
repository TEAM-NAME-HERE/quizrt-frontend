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

export type ProfileWithQuizzesQueryVariables = {
  id: string,
};

export type ProfileWithQuizzesQuery = {
  // The ID of the object
  profile:  {
    __typename: "ClassProfileNode",
    // The ID of the object.
    id: string,
    name: string,
    description: string,
    isPrivate: boolean,
    quizSet:  {
      __typename: "QuizNodeConnection",
      edges:  Array< {
        __typename: "QuizNodeEdge",
        // The item at the end of the edge
        node:  {
          __typename: "QuizNode",
          // The ID of the object.
          id: string,
          name: string,
          description: string,
          isPrivate: boolean,
        } | null,
      } | null >,
    } | null,
  } | null,
};

export type UserWithProfilesQueryVariables = {
  id: string,
};

export type UserWithProfilesQuery = {
  // The ID of the object
  user:  {
    __typename: "UserNode",
    username: string,
    email: string,
    name: string,
    // The ID of the object.
    id: string,
    classProfiles:  {
      __typename: "ClassProfileNodeConnection",
      edges:  Array< {
        __typename: "ClassProfileNodeEdge",
        // The item at the end of the edge
        node:  {
          __typename: "ClassProfileNode",
          // The ID of the object.
          id: string,
          name: string,
          description: string,
          isPrivate: boolean,
        } | null,
      } | null >,
    } | null,
  } | null,
};

export type ProfileFragment = {
  __typename: "ClassProfileNode",
  // The ID of the object.
  id: string,
  name: string,
  description: string,
  isPrivate: boolean,
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
