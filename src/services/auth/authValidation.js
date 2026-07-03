const validateLogin = (data) => {
  const errors = {};

  const username = data.username?.trim() || "";
  const password = data.password?.trim() || "";

  if (!username) {
    errors.username = "Username wajib diisi.";
  }

  if (!password) {
    errors.password = "Password wajib diisi.";
  } else if (password.length < 6) {
    errors.password = "Password minimal 6 karakter.";
  }

  return errors;
};

const authValidation = {
  login: validateLogin,
};

export default authValidation;