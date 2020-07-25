let searchForm = null;
let searchInput = null;
let searchButton = null;
let tabUsers = null;
let tabStatistics = null;

let allUsers = [];
let filteredUsers = [];

async function start() {
  searchForm = document.querySelector('form');
  searchInput = searchForm.querySelector('#search-input');
  searchButton = searchForm.querySelector('#search-button');

  tabUsers = document.querySelector('#tab-users');
  tabStatistics = document.querySelector('#tab-statistics');

  await fetchUsers();

  handleFormSubmit();
}
start();

async function fetchUsers() {
  // const res = await fetch(
  //   'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  // ); Dados da api copiados uma única vez. Irei usar o arquivo salvo.
  const res = await fetch('./js/apiUsers.json');
  const json = await res.json();
  allUsers = json.results
    .map(
      ({
        name: { first, last },
        picture: { thumbnail: photo },
        dob: { age },
        gender,
      }) => ({
        name: first + ' ' + last,
        gender,
        age,
        photo,
      })
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}

const handleFormSubmit = () => {
  let searchValue = null;

  searchInput.removeAttribute('disabled');
  searchButton.removeAttribute('disabled');
  // searchInput.addEventListener('keyup', (event) => {
  //   let hasText = !!event.target.value && event.target.value.trim() !== '';

  //   if (hasText) {
  //     searchButton.removeAttribute('disabled');
  //   } else {
  //     searchButton.setAttribute('disabled', '');
  //   }
  // });

  // const captureSearchValue = () => {
  //   searchValue = searchInput.value.toLowerCase().trim();
  //   searchInput.value = '';
  // };

  const search = () => {
    searchValue = searchInput.value.toLowerCase().trim();
    searchInput.value = '';

    filteredUsers = allUsers.filter((user) =>
      user.name.toLowerCase().trim().includes(searchValue)
    );
  };

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // captureSearchValue();

    search();
    render();
  });
};

const render = () => {
  const renderUserList = () => {
    const qtUsers = filteredUsers.length;

    let tabUsersContent = `
    <h2> ${qtUsers} usuário(s) encontrado(s)</h2>
    <div>
    `;

    filteredUsers.forEach(({ name, photo, age }) => {
      const userHTML = `
        <div>
          <img src="${photo}" alt="Foto de ${name}" />
          <span>${name}, ${age} anos</span>
        </div>
      `;

      tabUsersContent += userHTML;
    });

    tabUsersContent += '</div>';
    tabUsers.innerHTML = tabUsersContent;
  };

  const renderStatistics = () => {
    let tabStatisticsContent = `
      <h2>Estatísticas</h2>
      <div>`;

    tabStatisticsContent += '</div>';
    tabStatistics.innerHTML = tabStatisticsContent;
  };

  renderUserList();
  renderStatistics();
};
