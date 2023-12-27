const showImageGalleryFor = (imageUrls) => {
  if (imageUrls === "") {
    Swal.fire({
      text: "No hay imagenes cargadas",
      icon: "warning",
      confirmButtonColor: "#b61212",
    });
  } else {
    const images = imageUrls.split(","); // Has to be done this way, because the urls are send like a string. -asalvidio
    let imagesHTML = '<div class="image-gallery">';
    images.forEach((url) => {
      imagesHTML += `<img src="${url}" class="gallery-image" alt="Product image">`;
    });
    imagesHTML += "</div>";

    Swal.fire({
      html: imagesHTML,
      showConfirmButton: false,
      customClass: {
        container: "image-gallery-container",
      },
    });
  }
};
