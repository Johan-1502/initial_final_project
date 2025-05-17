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
    nombre: document.getElementById('create-detail-nombre'),
    idLabel: document.getElementById('create-label-id'),
    fechaInicio: document.getElementById('create-detail-fecha-inicio'),
    fechaFin: document.getElementById('create-detail-fecha-fin'),
    id: document.getElementById('create-detail-id'),
    client: document.getElementById('create-detail-client'),
    selectPlace: document.getElementById('create-selectPlace'),
    selectType: document.getElementById('create-selectType'),
  };

  console.log('idLabel', detailElementsCreate.idLabel)
  
  const detailElementsChange = {
    nombre: document.getElementById('change-detail-nombre'),
    fechaInicio: document.getElementById('change-detail-fecha-inicio'),
    fechaFin: document.getElementById('change-detail-fecha-fin'),
    id: document.getElementById('change-detail-id'),
    client: document.getElementById('change-detail-client'),
    selectPlace: document.getElementById('change-selectPlace'),
    selectType: document.getElementById('change-selectType'),
  };

  window.showEventDetails = (button) => {
    console.log(button.getAttribute("data-date"));
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