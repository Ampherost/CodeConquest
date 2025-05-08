export function handleError(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}
