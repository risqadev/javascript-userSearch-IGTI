let searchForm = null;
let searchInput = null;
let searchButton = null;
let tabUsers = null;
let tabStatistics = null;

let allUsers = [];

window.addEventListener('load', () => {
  searchForm = document.querySelector('form');
  searchInput = searchForm.querySelector('input');
  searchButton = searchForm.querySelector('button');

  tabUsers = document.querySelector('#tab-users');
  tabStatistics = document.querySelector('#tab-statistics');

  fetchUsers();

  handleFormSubmit();

  // render();
});

async function fetchUsers() {
  // const res = await fetch(
  //   'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  // ); Dados da api copiados uma única vez. Irei usar o arquivo salvo.
  const res = await fetch('./js/apiUsers.json');
  const json = await res.json();
  allUsers = json.results;
}

const handleFormSubmit = () => {
  let searchValue = null;

  const captureSearchValue = () => {
    searchValue = searchInput.value.toLowerCase().trim();
    searchInput.value = '';
  };

  const search = () => {};

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    captureSearchValue();

    search();
  });

  // render();
};

const render = () => {};
