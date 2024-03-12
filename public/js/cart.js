const deleteProductFrom = (aCartID, aProductID) => {
  Swal.fire({
    title: "¿Seguro que desea eliminar el producto del carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#b61212",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    preConfirm: async () => {
      try {
        const response = await fetch(
          `/api/carts/${aCartID}/products/${aProductID}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }
        Swal.fire({
          title: "Se eliminó el producto correctamente!",
          icon: "success",
          confirmButtonColor: "#b61212",
          preConfirm: () => {
            location.reload();
          },
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

const cleanCartIdentifiedBy = (aCartID) => {
  Swal.fire({
    title: "¿Seguro que desea vaciar el carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#b61212",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    preConfirm: async () => {
      try {
        const response = await fetch(`/api/carts/${aCartID}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Error al vaciar el carrito");
        }
        Swal.fire({
          title: "Se vació el carrito correctamente!",
          icon: "success",
          confirmButtonColor: "#b61212",
          preConfirm: () => {
            location.reload();
          },
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

const completePurchase = async (aCartID) => {
  try {
    const response = await fetch(`${aCartID}/purchase`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Error al realizar compra");
    }
    const ticket = (await response.json()).ticket;
    Swal.fire({
      title: "Compra realizada",
      html: `
      <div class="container px-4"> 
        <p>ID Compra: ${ticket._id}</p>
        <p>Fecha: ${ticket.purchaseDateTime}</p>
        <p>Monto: $${ticket.amount}</p>
        <p>Comprador: ${ticket.purchaser}</p>  
      </div> `,
      icon: "success",
      confirmButtonColor: "#b61212",
      preConfirm: () => {
        location.reload();
      },
    });
  } catch (error) {
    Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${error}`);
    console.log(error);
  }
};
