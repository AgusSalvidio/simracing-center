let currentCartID = sessionStorage.getItem("currentCartID");

if (!currentCartID) {
  Swal.fire({
    title: "Bienvenido a productos!",
    text: `Se creará un nuevo carrito que se guardará en el sessionStorage! En él, podrás agregar los productos.`,
    icon: "info",
    confirmButtonColor: "#b61212",
    preConfirm: async () => {
      try {
        const response = await fetch(`/api/carts`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Error al agregar producto al carrito");
        }
        const jsonResponse = await response.json();
        currentCartID = jsonResponse.cartID;
        sessionStorage.setItem("currentCartID", currentCartID);
        Swal.fire({
          title: `El ID del carrito es: ${currentCartID} `,
          icon: "success",
          confirmButtonColor: "#b61212",
        });
      } catch (error) {
        throw error;
      }
    },
  });
}

const addProduct = (aProductID) => {
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
          `/api/carts/${currentCartID}/product/${aProductID}`,
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
