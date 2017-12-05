/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type AdvanceQuestionMutationVariables = {
  id: string,
};

export type AdvanceQuestionMutation = {
  advanceQuestion:  {
    __typename: "AdvanceQuestionPayload",
    session:  {
      __typename: "SessionNode",
      // The ID of the object.
      id: string,
      isLocked: boolean,
      sessionDate: string,
      displayResults: boolean,
    } | null,
  } | null,
};

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
  name: string,
  quiz: string,
  duration?: number | null,
  order?: number | null,
};

export type CreateQuestionMutation = {
  createQuestion:  {
    __typename: "CreateQuestionPayload",
    question:  {
      __typename: "QuestionNode",
      // The ID of the object.
      id: string,
      prompt: string,
      name: string,
      orderNumber: number,
      questionDuration: number,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type CreateQuizMutationVariables = {
  name: string,
  description: string,
  isPrivate?: boolean | null,
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

export type CreateResponseMutationVariables = {
  session: string,
  user: string,
  delay?: number | null,
  answer: string,
};

export type CreateResponseMutation = {
  createResponse:  {
    __typename: "CreateResponsePayload",
    response:  {
      __typename: "ResponseNode",
      // The ID of the object.
      id: string,
      user: string,
      responseDelay: number,
    } | null,
    clientMutationId: string | null,
  } | null,
};

export type CreateSessionMutationVariables = {
  quiz: string,
  owner: string,
};

export type CreateSessionMutation = {
  createSession:  {
    __typename: "CreateSessionPayload",
    session:  {
      __typename: "SessionNode",
      // The ID of the object.
      id: string,
      isLocked: boolean,
      sessionDate: string,
      displayResults: boolean,
    } | null,
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

export type DisplayResultsMutationVariables = {
  id: string,
};

export type DisplayResultsMutation = {
  displayResults:  {
    __typename: "DisplayResultsPayload",
    session:  {
      __typename: "SessionNode",
      // The ID of the object.
      id: string,
      isLocked: boolean,
      sessionDate: string,
      displayResults: boolean,
    } | null,
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
  name?: string | null,
  order?: number | null,
  duration?: number | null,
};

export type UpdateQuestionMutation = {
  updateQuestion:  {
    __typename: "UpdateQuestionPayload",
    question:  {
      __typename: "QuestionNode",
      // The ID of the object.
      id: string,
      prompt: string,
      name: string,
      orderNumber: number,
      questionDuration: number,
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

export type AnswersQueryVariables = {
  before?: string | null,
  after?: string | null,
  first?: number | null,
  last?: number | null,
  question?: string | null,
};

export type AnswersQuery = {
  answers:  {
    __typename: "AnswerNodeConnection",
    pageInfo:  {
      __typename: "PageInfo",
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
      // When paginating backwards, are there more items?
      hasPreviousPage: boolean,
      // When paginating backwards, the cursor to continue.
      startCursor: string | null,
      // When paginating forwards, the cursor to continue.
      endCursor: string | null,
    },
    edges:  Array< {
      __typename: "AnswerNodeEdge",
      // The item at the end of the edge
      node:  {
        __typename: "AnswerNode",
        // The ID of the object.
        id: string,
        description: string,
        isCorrect: boolean,
      } | null,
      // A cursor for use in pagination
      cursor: string,
    } | null >,
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
    name: string,
    orderNumber: number,
    questionDuration: number,
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

export type QuizzesQueryVariables = {
  before?: string | null,
  after?: string | null,
  first?: number | null,
  last?: number | null,
  name?: string | null,
  description?: string | null,
  profile?: string | null,
  isPrivate?: boolean | null,
};

export type QuizzesQuery = {
  quizzes:  {
    __typename: "QuizNodeConnection",
    pageInfo:  {
      __typename: "PageInfo",
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
      // When paginating backwards, are there more items?
      hasPreviousPage: boolean,
      // When paginating backwards, the cursor to continue.
      startCursor: string | null,
      // When paginating forwards, the cursor to continue.
      endCursor: string | null,
    },
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
      // A cursor for use in pagination
      cursor: string,
    } | null >,
  } | null,
};

export type ResponsesQueryVariables = {
  before?: string | null,
  after?: string | null,
  first?: number | null,
  last?: number | null,
  session?: string | null,
};

export type ResponsesQuery = {
  responses:  {
    __typename: "ResponseNodeConnection",
    pageInfo:  {
      __typename: "PageInfo",
      // When paginating forwards, are there more items?
      hasNextPage: boolean,
      // When paginating backwards, are there more items?
      hasPreviousPage: boolean,
      // When paginating backwards, the cursor to continue.
      startCursor: string | null,
      // When paginating forwards, the cursor to continue.
      endCursor: string | null,
    },
    edges:  Array< {
      __typename: "ResponseNodeEdge",
      // The item at the end of the edge
      node:  {
        __typename: "ResponseNode",
        // The ID of the object.
        id: string,
        user: string,
        responseDelay: number,
        answer:  {
          __typename: "AnswerNode",
          description: string,
          // The ID of the object.
          id: string,
        },
      } | null,
      // A cursor for use in pagination
      cursor: string,
    } | null >,
  } | null,
};

export type SessionQueryVariables = {
  id: string,
};

export type SessionQuery = {
  // The ID of the object
  session:  {
    __typename: "SessionNode",
    // The ID of the object.
    id: string,
    isLocked: boolean,
    sessionDate: string,
    displayResults: boolean,
    owner:  {
      __typename: "UserNode",
      username: string,
      email: string,
      name: string,
      // The ID of the object.
      id: string,
    },
    currentQuestion:  {
      __typename: "QuestionNode",
      // The ID of the object.
      id: string,
      prompt: string,
      name: string,
      orderNumber: number,
      questionDuration: number,
    } | null,
    quiz:  {
      __typename: "QuizNode",
      // The ID of the object.
      id: string,
      name: string,
      description: string,
      isPrivate: boolean,
    },
  } | null,
};

export type UserQueryVariables = {
  user: string,
};

export type UserQuery = {
  // The ID of the object
  user:  {
    __typename: "UserNode",
    username: string,
    email: string,
    name: string,
    // The ID of the object.
    id: string,
  } | null,
};

export type UserScoresQueryVariables = {
  session: string,
};

export type UserScoresQuery = {
  userScores:  Array< {
    __typename: "UserScore",
    username: string,
    score: number,
  } | null >,
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

export type PageInfoFragment = {
  __typename: "PageInfo",
  // When paginating forwards, are there more items?
  hasNextPage: boolean,
  // When paginating backwards, are there more items?
  hasPreviousPage: boolean,
  // When paginating backwards, the cursor to continue.
  startCursor: string | null,
  // When paginating forwards, the cursor to continue.
  endCursor: string | null,
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
  name: string,
  orderNumber: number,
  questionDuration: number,
};

export type QuizScalarFragment = {
  __typename: "QuizNode",
  // The ID of the object.
  id: string,
  name: string,
  description: string,
  isPrivate: boolean,
};

export type ResponseFragment = {
  __typename: "ResponseNode",
  // The ID of the object.
  id: string,
  user: string,
  responseDelay: number,
  answer:  {
    __typename: string,
    description: string,
    // The ID of the object.
    id: string,
  },
};

export type ResponseScalarFragment = {
  __typename: "ResponseNode",
  // The ID of the object.
  id: string,
  user: string,
  responseDelay: number,
};

export type SessionScalarFragment = {
  __typename: "SessionNode",
  // The ID of the object.
  id: string,
  isLocked: boolean,
  sessionDate: string,
  displayResults: boolean,
};

export type UserScalarFragment = {
  __typename: "UserNode",
  username: string,
  email: string,
  name: string,
  // The ID of the object.
  id: string,
};
