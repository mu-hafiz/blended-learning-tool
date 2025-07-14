export const validatePassword = (password: string) => [
  {
    check: password.length >= 8,
    message: "Must be 8 or more characters",
  },
  {
    check: /[a-z]/.test(password),
    message: "Must contain a lower case letter",
  },
  {
    check: /[A-Z]/.test(password),
    message: "Must contain an upper case letter",
  },
  {
    check: /[0-9]/.test(password),
    message: "Must contain a number",
  },
  {
    check: /[^A-Za-z0-9]/.test(password),
    message: "Must contain a symbol",
  }
];