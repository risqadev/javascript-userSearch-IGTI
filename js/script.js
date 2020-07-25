let allUsers = [];
let filteredUsers = [];

let searchForm = null;
let searchInput = null;
let searchButton = null;
let tabUsers = null;
let tabStatistics = null;

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
  /* const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  ); */
  // Dados da api copiados uma única vez para evitar muitas requisições à API original. Usaremos a partir de agora o arquivo salvo.
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
  searchInput.addEventListener('keyup', (event) => {
    let hasText = !!event.target.value && event.target.value.trim() !== '';

    if (hasText) {
      searchButton.removeAttribute('disabled');
    } else {
      searchButton.setAttribute('disabled', '');
    }
  });

  const search = () => {
    searchValue = searchInput.value.toLowerCase().trim();
    // searchInput.value = '';

    filteredUsers = allUsers.filter(({ name }) =>
      name.toLowerCase().trim().includes(searchValue)
    );
  };

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    search();
    render();
  });
};

const render = () => {
  const countUsers = filteredUsers.length;
  const countMale = filteredUsers.reduce(
    (count, { gender }) => (gender === 'male' ? count + 1 : count),
    0
  );
  const countFem = filteredUsers.reduce(
    (count, { gender }) => (gender === 'female' ? count + 1 : count),
    0
  );
  const ageSum = filteredUsers.reduce(
    (accululator, { age }) => accululator + age,
    0
  );
  const ageAvg = ageSum / countUsers;

  const renderUserList = () => {
    let tabUsersContent = `
    <h2> ${countUsers} usuário(s) encontrado(s)</h2>
    <div>
    `;

    filteredUsers.forEach(({ name, photo, age }) => {
      const userHTML = `
        <div class="user">
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
      <ul>
        <li>Sexo masculino: <strong>${formatNumber(countMale)}</strong></li>
        <li>Sexo feminino: <strong>${formatNumber(countFem)}</strong></li>
        <li>Soma das idades: <strong>${formatNumber(ageSum)}</strong></li>
        <li>Média das idades: <strong>${formatNumber(ageAvg)}</strong></li>
      </ul>
    `;

    tabStatistics.innerHTML = tabStatisticsContent;
  };

  const formatNumber = (number) => {
    return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
      number
    );
  };

  renderUserList();
  renderStatistics();
};
