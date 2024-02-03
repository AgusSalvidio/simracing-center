const logout = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
    });
    if (!response.ok) {
      const parsedResponse = await response.json();
      throw new Error(parsedResponse.payload);
    }
    Swal.fire({
      text: "Cierre de sesión exitoso!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(function () {
      window.location.href = "/login";
    });
  } catch (error) {
    Swal.fire({
      text: `Error al cerrar sesión: ${error.message}`,
      icon: "warning",
      confirmButtonColor: "#b61212",
    });
  }
};
