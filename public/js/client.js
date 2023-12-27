const socket = io();

const registerNewProduct = () => {
  Swal.fire({
    title: "Agregar Producto",
    html: `
    <form id="productForm" enctype="multipart/form-data">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row text-left">
            <div class="col-md-6">
              <label for="title" class="col-form-label">Título</label>
              <input id="title" type="text" name="title" class="form-control" placeholder="Título"> 
            </div>
            <div class="col-md-6">
              <label for="description" class="col-form-label">Descripción</label>
              <input id="description" type="text" name="description" class="form-control" placeholder="Descripción">
            </div>
            <div class="col-md-6">
              <label for="category" class="col-form-label">Categoria</label>
              <input id="category" type="text" name="category" class="form-control" placeholder="Categoria">
            </div>
            <div class="col-md-6">
              <label for="price" class="col-form-label">Precio</label>
              <input id="price" type="text" name="price" class="form-control" placeholder="Precio">
            </div>
            <div class="col-md-6">
              <label for="stock" class="col-form-label">Stock</label>
              <input id="stock" type="text" name="stock" class="form-control" placeholder="Stock">
            </div>
            <div class="col-md-6">
              <label for="code" class="col-form-label">Código</label>
              <input id="code" type="text" name="code" class="form-control" placeholder="Código">
            </div>
            <div class="col-md-6">
              <label for="thumbnails" class="col-form-label">Imagenes</label>
              <input id="thumbnails" name="thumbnails" type="file" class="form-control" placeholder="Seleccione imagenes">
            </div>
          </div>   
        </div>
      </div>
    </form>
      `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Agregar",
    confirmButtonColor: "#b61212",
    preConfirm: () => {
      const formData = new FormData(document.getElementById("productForm"));
      if (formIsValid()) {
        try {
          fetch("/", { method: "POST", body: formData })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error("Error al agregar el producto");
            })
            .then((data) => {
              socket.emit("addedProductEvent", data);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        return false;
      }
    },
  });
};

const deleteProduct = (aProductID) => {
  Swal.fire({
    title: "¿Seguro que desea eliminar el producto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#b61212",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  })
    .then((result) => {
      if (result.isConfirmed) {
        socket.emit("deleteProductEvent", aProductID);
        refreshProductsTable();
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const refreshProductsTable = async (products) => {
  let productsTableBody = document.getElementById("products_tbody");
  let content = ``;
  if (products == []) {
    content += `  <tr>
      <td colspan="8">No hay productos</td>
      </tr>`;
  } else {
    products.forEach((product) => {
      content += `
        <tr>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td class="px-4">
        <a
        onclick="showImageIdentifiedBy('${product.thumbnails}')"
              class="btn-sm clickable"
              ><i class="fa-regular fa-image"></i></a>
              </td>
              <td class="px-4">
              <a
              onclick="deleteProduct('${product.id}')"
              class="btn-sm clickable"
            ><i class="fa-solid fa-xmark" style="color:#b61212"></i></a>
          </td>
        </tr>
              `;
    });
  }
  productsTableBody.innerHTML = content;
};

const formIsValid = () => {
  $("#productForm").validate({
    rules: {
      title: {
        required: true,
      },
      description: {
        required: true,
      },
      code: {
        required: true,
      },
      category: {
        required: true,
      },
      price: {
        required: true,
        digits: true,
      },
      stock: {
        required: true,
        digits: true,
      },
    },
    messages: {
      title: { required: "Campo requerido." },
      description: { required: "Campo requerido." },
      code: {
        required: "Campo requerido.",
      },
      category: {
        required: "Campo requerido.",
      },
      price: {
        required: "Campo requerido.",
        digits: "Ingrese un precio válido.",
      },
      stock: {
        required: "Campo requerido.",
        digits: "Ingrese una cantidad de stock válida.",
      },
    },
  });
  return $("#productForm").valid();
};

socket.on("updateProductTableEvent", async (products) => {
  refreshProductsTable(products);
});
