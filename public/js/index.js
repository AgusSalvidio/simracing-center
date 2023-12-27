const showImageIdentifiedBy = (anImageUrl) => {
  Swal.fire({
    imageUrl: anImageUrl,
    imageWidth: 600,
    imageHeight: 300,
    imageAlt: "A product image",
    showConfirmButton: false,
  });
};

