import { setupSearch } from './search.js';
import { setupCreate } from './create.js';
import { setupUpdate, setupDelete, showMessage } from './update_delete.js';
import { showDetails } from './details.js';


document.addEventListener("DOMContentLoaded", () => {
  const message = sessionStorage.getItem("successMessage");
  if (message) {
    showMessage(message, "success");
    sessionStorage.removeItem("successMessage");
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const resultsList = document.getElementById('resultsList');
  const searchInput = document.getElementById('searchInput');
  const updateButton = document.getElementById('update-button');
  const changeForm = document.getElementById('changeForm');
  const activateCreateButton = document.getElementById("activateCreateButton");
  const buttonContainer = document.getElementById("button-container");
  const searchContainer = document.getElementById("search-container");
  const detailContainer = document.getElementById("detail-container");
  const deleteButton = document.getElementById("delete-button");

  const detailElementsCreate = {
    cc: document.getElementById('create-detail-cc'),
    nombre: document.getElementById('create-detail-nombre'),
    telefono: document.getElementById('create-detail-telefono'),
    direccion: document.getElementById('create-detail-direccion'),
    correo: document.getElementById('create-detail-correo'),
  };

  const detailElementsChange = {
    cc: document.getElementById('change-detail-cc'),
    nombre: document.getElementById('change-detail-nombre'),
    telefono: document.getElementById('change-detail-telefono'),
    direccion: document.getElementById('change-detail-direccion'),
    correo: document.getElementById('change-detail-correo'),
  };

  window.showDetails = (button) => {
    showDetails(
      button,
      detailElementsChange,
      searchContainer,
      detailContainer,
      buttonContainer
    );
  };

  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  setupSearch(resultsList, searchInput);
  setupCreate(activateCreateButton, detailElementsCreate, searchContainer, buttonContainer, detailContainer);
  setupUpdate(updateButton, changeForm, detailElementsChange, csrfToken);
  setupDelete(deleteButton, changeForm, csrfToken);
});