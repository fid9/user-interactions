import statusCode from 'http-status';

import { ErrorType } from './enums';

class HTTPError extends Error {
	public type = ErrorType.Default;

	public httpStatus = statusCode.BAD_REQUEST;

	public constructor(httpStatus: number, type: ErrorType, message = '') {
		super();
		this.message = message;
		this.type = type;
		this.httpStatus = httpStatus;
	}
}

export default HTTPError;
