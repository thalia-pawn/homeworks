export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.reason = 'INVALID_INPUT';
    this.description = message;
    this.statusCode = 400;
  }
}

export class EntitityNotFound extends Error {
  constructor(message) {
    super(message);
    this.reason = 'NOT_FOUND';
    this.description = message;
    this.statusCode = 404;
  }
}

export class AuthError extends Error {
    constructor(message) {
    super(message);
    this.reason = 'AUTH_ERROR';
    this.description = message;
    this.statusCode = 401;
  }
}
