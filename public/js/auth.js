const login = async () => {
  const formData = new FormData(document.getElementById("loginForm"));
  if (loginFormIsValid()) {
    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error al loguearse");
      }
      location.href("/products");
    } catch (error) {
      console.log(error);
    }
  }
};

const register = async () => {
  const formData = new FormData(document.getElementById("registerForm"));
  if (registerFormIsValid()) {
    try {
      const response = await fetch("/api/auth/register/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error al registrarse");
      }
      location.href("/login");
    } catch (error) {
      console.log(error);
    }
  }
};

const formIsValidFor = (aFormId, aRuleCollection) => {
  $(aFormId).validate(aRuleCollection);
  return $(aFormId).valid();
};

const loginFormIsValid = () => {
  const formID = "#loginForm";
  const rules = {
    rules: {
      email: {
        required: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      email: {
        required: "Campo requerido.",
        email: "Ingresar un email válido",
      },
      password: { required: "Campo requerido." },
    },
  };
  return formIsValidFor(formID, rules);
};

const registerFormIsValid = () => {
  const formID = "#registerForm";
  const rules = {
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      email: {
        required: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      firstName: { required: "Campo requerido." },
      lastName: { required: "Campo requerido." },
      email: {
        required: "Campo requerido.",
        email: "Ingresar un email válido",
      },
      password: { required: "Campo requerido." },
    },
  };
  return formIsValidFor(formID, rules);
};
