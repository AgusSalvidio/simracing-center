const addProduct = (aProductID, aCartID) => {
  Swal.fire({
    title: "¿Seguro que desea agregar el producto al carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#b61212",
    confirmButtonText: "Agregar",
    cancelButtonText: "Cancelar",
    preConfirm: async () => {
      try {
        const response = await fetch(
          `/api/carts/${aCartID}/product/${aProductID}`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error("Error al agregar producto al carrito");
        }
        Swal.fire({
          title: "Se agregó el producto al carrito correctamente!",
          icon: "success",
          confirmButtonColor: "#b61212",
        });
      } catch (error) {
        Swal.showValidationMessage(
          `<i class="fa fa-info-circle"></i> ${error}`
        );
        console.log(error);
      }
    },
  });
};
