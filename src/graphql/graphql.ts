/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateAnswerMutationVariables = {
  description: string,
  question: string,
  isCorrect: boolean,
};

export type CreateAnswerMutation = {
  createAnswer:  {
    __typename: "CreateAnswerPayload",
    answer:  {
      __typename: "AnswerNode",
      // The ID of the object.
      id: string,
      description: string,
      isCorrect: boolean,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type CreateQuestionMutationVariables = {
  prompt: string,
  quiz: string,
};

export type CreateQuestionMutation = {
  createQuestion:  {
    __typename: "CreateQuestionPayload",
    question:  {
      __typename: "QuestionNode",
      // The ID of the object.
      id: string,
      prompt: string,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type CreateQuizMutationVariables = {
  name: string,
  description: string,
  isPrivate: boolean,
  profile: string,
};

export type CreateQuizMutation = {
  createQuiz:  {
    __typename: "CreateQuizPayload",
    quiz:  {
      __typename: "QuizNode",
      // The ID of the object.
      id: string,
      name: string,
      description: string,
      isPrivate: boolean,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type DeleteAnswerMutationVariables = {
  id: string,
};

export type DeleteAnswerMutation = {
  deleteAnswer:  {
    __typename: "DeleteAnswerPayload",
    success: boolean | null,
    clientMutationId: string | null,
  } | null,
};

export type DeleteQuestionMutationVariables = {
  id: string,
};

export type DeleteQuestionMutation = {
  deleteQuestion:  {
    __typename: "DeleteQuestionPayload",
    success: boolean | null,
    clientMutationId: string | null,
  } | null,
};

export type DeleteQuizMutationVariables = {
  id: string,
};

export type DeleteQuizMutation = {
  deleteQuiz:  {
    __typename: "DeleteQuizPayload",
    success: boolean | null,
    clientMutationId: string | null,
  } | null,
};

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

export type UpdateAnswerMutationVariables = {
  id: string,
  description?: string | null,
  isCorrect?: boolean | null,
};

export type UpdateAnswerMutation = {
  updateAnswer:  {
    __typename: "UpdateAnswerPayload",
    answer:  {
      __typename: "AnswerNode",
      // The ID of the object.
      id: string,
      description: string,
      isCorrect: boolean,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type UpdateQuestionMutationVariables = {
  id: string,
  prompt?: string | null,
};

export type UpdateQuestionMutation = {
  updateQuestion:  {
    __typename: "UpdateQuestionPayload",
    question:  {
      __typename: "QuestionNode",
      // The ID of the object.
      id: string,
      prompt: string,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type UpdateQuizMutationVariables = {
  id: string,
  name?: string | null,
  description?: string | null,
  isPrivate?: boolean | null,
};

export type UpdateQuizMutation = {
  updateQuiz:  {
    __typename: "UpdateQuizPayload",
    quiz:  {
      __typename: "QuizNode",
      // The ID of the object.
      id: string,
      name: string,
      description: string,
      isPrivate: boolean,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type AnswerQueryVariables = {
  id: string,
};

export type AnswerQuery = {
  // The ID of the object
  answer:  {
    __typename: "AnswerNode",
    // The ID of the object.
    id: string,
    description: string,
    isCorrect: boolean,
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

export type QuestionQueryVariables = {
  id: string,
};

export type QuestionQuery = {
  // The ID of the object
  question:  {
    __typename: "QuestionNode",
    // The ID of the object.
    id: string,
    prompt: string,
    answerSet:  {
      __typename: "AnswerNodeConnection",
      edges:  Array< {
        __typename: "AnswerNodeEdge",
        // The item at the end of the edge
        node:  {
          __typename: "AnswerNode",
          // The ID of the object.
          id: string,
        } | null,
      } | null >,
    } | null,
  } | null,
};

export type QuizQueryVariables = {
  id: string,
};

export type QuizQuery = {
  // The ID of the object
  quiz:  {
    __typename: "QuizNode",
    // The ID of the object.
    id: string,
    name: string,
    description: string,
    isPrivate: boolean,
    questionSet:  {
      __typename: "QuestionNodeConnection",
      edges:  Array< {
        __typename: "QuestionNodeEdge",
        // The item at the end of the edge
        node:  {
          __typename: "QuestionNode",
          // The ID of the object.
          id: string,
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

export type AnswerScalarFragment = {
  __typename: "AnswerNode",
  // The ID of the object.
  id: string,
  description: string,
  isCorrect: boolean,
};

export type ProfileScalarFragment = {
  __typename: "ClassProfileNode",
  // The ID of the object.
  id: string,
  name: string,
  description: string,
  isPrivate: boolean,
};

export type QuestionScalarFragment = {
  __typename: "QuestionNode",
  // The ID of the object.
  id: string,
  prompt: string,
};

export type QuizScalarFragment = {
  __typename: "QuizNode",
  // The ID of the object.
  id: string,
  name: string,
  description: string,
  isPrivate: boolean,
};

export type UserScalarFragment = {
  __typename: "UserNode",
  username: string,
  email: string,
  name: string,
  // The ID of the object.
  id: string,
};
