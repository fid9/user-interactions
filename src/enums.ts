export enum ErrorType {
    Default = 'default',
    UserAlreadyExists = 'user_already_exists',
    UserNotFound = 'user_not_found',
    WrongUsernameOrPassword = 'wrong_username_or_password',
    UserCouldNotBeCreated = 'user_could_not_be_created',
}

export enum QueryTestId {
    GetUser = 'GetUser',
    CreateUser = 'CreateUser',
    GetMostLiked = 'GetMostLiked',
    GetUserLikes = 'GetUserLikes',
    CreateLike = 'CreateLike',
    DeleteLike = 'DeleteLike'
}