const parseFromDataToObject = (formData) => {
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  return formDataObject;
};

const login = async () => {
  const formData = new FormData(authForm);
  if (loginFormIsValid()) {
    try {
      const parsedFormData = parseFromDataToObject(formData);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(parsedFormData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        const parsedResponse = await response.json();
        throw new Error(parsedResponse.payload);
      }
      Swal.fire({
        text: "Inicio de sesión exitoso!",
        icon: "success",
        confirmButtonColor: "#b61212",
        confirmButtonText: "OK",
        preConfirm: async () => {
          try {
            window.location.href = "/products";
          } catch (error) {
            throw error;
          }
        },
      });
    } catch (error) {
      Swal.fire({
        text: `Error al iniciar sesión: ${error.message}`,
        icon: "warning",
        confirmButtonColor: "#b61212",
      });
    }
  }
};

const register = async () => {
  const formData = new FormData(authForm);
  if (registerFormIsValid()) {
    try {
      const parsedFormData = parseFromDataToObject(formData);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(parsedFormData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        const parsedResponse = await response.json();
        throw new Error(parsedResponse.payload);
      }
      Swal.fire({
        text: "Registro exitoso!",
        icon: "success",
        confirmButtonColor: "#b61212",
        confirmButtonText: "OK",
        preConfirm: async () => {
          try {
            window.location.href = "/login";
          } catch (error) {
            throw error;
          }
        },
      });
    } catch (error) {
      Swal.fire({
        text: `Error al registrarse: ${error.message}`,
        icon: "warning",
        confirmButtonColor: "#b61212",
      });
    }
  }
};

const formIsValidFor = (aFormId, aRuleCollection) => {
  $(aFormId).validate(aRuleCollection);
  return $(aFormId).valid();
};

const loginFormIsValid = () => {
  const formID = "#authForm";
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
  const formID = "#authForm";
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

const authForm = document.getElementById("authForm");

authForm.addEventListener("submit", function (event) {
  event.preventDefault();
  try {
    authForm.name == "loginForm" ? login() : register();
  } catch (error) {
    throw error;
  }
});

authForm.addEventListener("submit", function (event) {
  event.preventDefault();
  try {
    authForm.name == "loginForm" ? login() : register();
  } catch (error) {
    throw error;
  }
});
