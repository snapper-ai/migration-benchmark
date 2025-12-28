export function validationError(message, fields = {}) {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message,
      fields,
    },
  };
}


