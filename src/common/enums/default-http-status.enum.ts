/**
 * JSend specification status types
 * @see https://github.com/omniti-labs/jsend
 */

export enum DefaultHttpStatus {
  Success = 'success', // All went well, possibly returning data
  Fail = 'fail', // Request failed due to client error (validation failed, etc.)
  Error = 'error', // An error occurred in processing the request (exceptionsm etc,)
}
