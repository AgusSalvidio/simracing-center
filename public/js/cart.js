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

const successfulAlertFor = (aTicket) => {
  const parsedDate = new Date(aTicket.purchaseDateTime).toLocaleString(
    "es-AR",
    {
      timeZone: "America/Argentina/Buenos_Aires",
    }
  );

  Swal.fire({
    title: "Compra realizada",
    html: `
    <div class="container px-4"> 
      <p>ID Compra: ${aTicket._id}</p>
      <p>Fecha: ${parsedDate}</p>
      <p>Monto: $${aTicket.amount}</p>
      <p>Comprador: ${aTicket.purchaser}</p>  
    </div> `,
    icon: "success",
    confirmButtonColor: "#b61212",
    preConfirm: () => {
      location.reload();
    },
  });
};

const completePurchase = async (aCartID) => {
  try {
    const response = await fetch(`${aCartID}/purchase`, {
      method: "POST",
    });
    const responseContents = await response.json();
    if (!response.ok) {
      if (responseContents.hasUnpurchasedProducts) {
        Swal.fire({
          title: "Error en la compra",
          text: `No se pudo realizar la compra: ${responseContents.payload}`,
          icon: "error",
          confirmButtonColor: "#b61212",
        });
      } else {
        throw new Error("Error al realizar compra");
      }
    } else {
      if (responseContents.hasUnpurchasedProducts) {
        Swal.fire({
          title: "Compra Incompleta",
          text: "No se pudo realizar la compra de algunos productos, los mismos quedarán en el carrito. Se generó el ticket para aquellos que tenian stock.",
          icon: "warning",
          confirmButtonColor: "#b61212",
          preConfirm: () => {
            successfulAlertFor(responseContents.ticket);
          },
        });
      } else successfulAlertFor(responseContents.ticket);
    }
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: `${error}`,
      icon: "error",
      confirmButtonColor: "#b61212",
    });
    console.log(error);
  }
};
