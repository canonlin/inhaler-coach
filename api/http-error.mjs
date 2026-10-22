/**
 * The one error type the API raises on purpose.
 *
 * It lives in its own module because both the route handlers and the auth
 * layer need it, and a shared error class that lives inside the 900-line route
 * file would force one to import the other.
 */
export class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.name = "HttpError";
		this.status = status;
	}
}
