const login = ({ email, password }) => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = "Email wajib diisi";
  }

  if (!password?.trim()) {
    errors.password = "Password wajib diisi";
  }

  return errors;
};

const authValidation = {
  login,
};

export default authValidation;