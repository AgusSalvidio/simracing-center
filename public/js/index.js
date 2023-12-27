const showImageGalleryFor = (imageUrls) => {
  const images = JSON.parse(imageUrls);
  if (images.length === 0) {
    Swal.fire({
      text: "No hay imagenes cargadas",
      icon: "warning",
      confirmButtonColor: "#b61212",
    });
  } else {
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
