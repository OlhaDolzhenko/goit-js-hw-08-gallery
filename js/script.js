import gallery from "./gallery-items.js";

const galleryRef = document.querySelector("ul.js-gallery");
const modaleWindowRef = document.querySelector("div.js-lightbox");
const modaleImageRef = document.querySelector("img.lightbox__image");
const closeModaleBtnRef = document.querySelector("button[data-action]");
const modaleOverlayRef = document.querySelector("div.lightbox__overlay");

galleryRef.insertAdjacentHTML("beforeend", addImage(gallery));
galleryRef.addEventListener("click", getOriginalImage);
closeModaleBtnRef.addEventListener("click", closeModal);
modaleOverlayRef.addEventListener("click", closeOnOverlayClick);

function addImage(array) {
  let index = 0;
  return array.reduce((acc, image) => {
    acc += `<li class="gallery__item">
  <a
    class="gallery__link"
    href=${image.original}
  >
    <img
      class="gallery__image"
      src=${image.preview}
      data-source=${image.original}
      data-index=${index}
      alt=${image.description}
    />
  </a>
</li>`;
    index++;
    return acc;
  }, "");
}

function getOriginalImage(event) {
  event.preventDefault();
  if (event.target.nodeName !== "IMG") {
    return;
  }
  const originalImage = event.target.dataset.source;
  const altForModalImage = event.target.alt;
  const dataIndex = event.target.dataset.index;
  openModal(originalImage, altForModalImage, dataIndex);
}

function openModal(image, alt, index) {
  modaleWindowRef.classList.add("is-open");
  modaleImageRef.src = image;
  modaleImageRef.alt = alt;
  modaleImageRef.dataset.index = index;
  window.addEventListener("keydown", (event) => handleKeyDown(event));
}

function handleKeyDown(event) {
  if (!modaleWindowRef.classList.contains("is-open")) return;
  if (event.code === "Escape") return closeModal();
  if (event.code === "ArrowRight") return getNextImage();
  if (event.code === "ArrowLeft") return getPrevImage();
}

function getNextImage() {
  const currentImageIndex = Number(modaleImageRef.dataset.index);
  const arrayLength = gallery.length - 1;
  if (currentImageIndex === arrayLength) return;
  modaleImageRef.src = gallery[currentImageIndex + 1].original;
  modaleImageRef.dataset.index = currentImageIndex + 1;
  modaleImageRef.alt = gallery[currentImageIndex + 1].description;
}
function getPrevImage() {
  const currentImageIndex = Number(modaleImageRef.dataset.index);
  if (currentImageIndex === 0) return;
  modaleImageRef.src = gallery[currentImageIndex - 1].original;
  modaleImageRef.dataset.index = currentImageIndex - 1;
  modaleImageRef.alt = gallery[currentImageIndex - 1].description;
}

function closeModal() {
  modaleImageRef.src = "";
  modaleImageRef.alt = "";
  modaleWindowRef.classList.remove("is-open");
  window.removeEventListener("keydown", (event) => handleKeyDown(event));
}

function closeOnOverlayClick(event) {
  if (event.target !== event.currentTarget) return;
  closeModal();
}
