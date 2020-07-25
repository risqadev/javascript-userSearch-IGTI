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
  let countUsers = filteredUsers.length;
  let countMasc = 0;
  let countFem = 0;
  let ageSum = 0;
  let ageAvg = 0;

  const renderUserList = () => {
    let tabUsersContent = `
    <h3> ${countUsers} usuário(s) encontrado(s)</h3>
    <div>
    `;

    filteredUsers.forEach(({ name, photo, age, gender }) => {
      if (gender === 'male') {
        countMasc += 1;
      }
      if (gender === 'female') {
        countFem += 1;
      }

      ageSum += age;

      const userHTML = `
        <div class="user">
          <img src="${photo}" alt="Foto de ${name}" />
          <span>${name}, ${age} anos</span>
        </div>
      `;

      tabUsersContent += userHTML;
    });

    ageAvg = ageSum / countUsers;

    tabUsersContent += '</div>';
    tabUsers.innerHTML = tabUsersContent;
  };

  const renderStatistics = () => {
    let tabStatisticsContent = `
      <h3>Estatísticas</h3>
      <ul>
        <li>Sexo masculino: <strong>${formatNumber(countMasc)}</strong></li>
        <li>Sexo feminino: <strong>${formatNumber(countFem)}</strong></li>
        <li>Soma das idades: <strong>${formatNumber(ageSum)}</strong></li>
        <li>Média das idades: <strong>${formatNumber(ageAvg)}</strong></li>
      </ul>
    `;

    tabStatistics.innerHTML = tabStatisticsContent;
  };

  renderUserList();
  renderStatistics();
};

const formatNumber = (number) => {
  return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
    number
  );
};
