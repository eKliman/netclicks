const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  tvShows = document.querySelector('.tv-shows'),
  tvCardImg = document.querySelector('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  rating = document.querySelector('.rating'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  preloader = document.querySelector('.preloader'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = document.querySelector('.search__form-input'),
  dropdown = document.querySelectorAll('.dropdown'),
  tvShowsHead = document.querySelector('.tv-shows__head'),
  pagination = document.querySelector('.pagination');

//div creation for animated bootloader
const loading = document.createElement('div');
loading.className = 'loading';

//class creation
const DBService = class {
  constructor() {
    this.SERVER = 'https://api.themoviedb.org/3';
    this.API_KEY = '2e1581dff0a43fe39fff65978ab4df77';
  }

  async getData(url) {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Couldn't get the data at ${url}`);
    }
  }

  getTestData() {
    return this.getData('test.json');
  }

  getTestCard() {
    return this.getData('card.json');
  }

  getSearchResult(query) {
    this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
    return this.getData(this.temp);
  }

  getNextPage(page) {
    return this.getData(this.temp + '&page=' + page);
  }

  getTvShow(id) {
    this.getData(
      this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY + '&language=ru-RU'
    );
  }

  getTopRated() {
    this.getData(
      `${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`
    );
  }

  getPopular() {
    this.getData(
      `${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`
    );
  }

  getToday() {
    this.getData(
      `${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`
    );
  }

  getWeek() {
    this.getData(
      `${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`
    );
  }
};

const dbservice = new DBService();

//closing drop-down items when exit the menu
const closeDropdown = () => {
  dropdown.forEach((item) => {
    item.classList.remove('active');
  });
};

//render cards
const renderCard = (response, target) => {
  tvShowsList.textContent = '';

  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent =
      'К сожалению по вашему запросу ничего не найдено ...';
    tvShowsHead.style.cssText = 'color: red; border-bottom: 2px solid red';
    return;
  }
  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
  tvShowsHead.style.cssText = 'color: black; border-bottom: 2px solid gray';
  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg',
      backdropIMG = backdrop ? IMG_URL + backdrop : '',
      voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

    const card = document.createElement('li');
    card.idTV = id;
    card.className = 'tv-shows__item';
    // card.classList.add('tv-shows__item');
    card.innerHTML = `
      <a href="#" id="${id}" class="tv-card">
        ${voteElem}
        <img class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}">
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;

    loading.remove();
    tvShowsList.append(card);
    // tvShowsList.insertAdjacentElement('afterbegin', card);
  });

  pagination.textContent = '';
  if (!target && response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
    }
  }
};

//server search query
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  tvShows.append(loading);
  const value = searchFormInput.value.trim();
  if (value) {
    dbservice.getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = '';
});

//menu opening/closing
hamburger.addEventListener('click', () => {
  closeDropdown();
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

//close the menu by clicking outside of it
document.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.closest('.left-menu')) {
    closeDropdown();
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

//drop-down menu implamintation
leftMenu.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }

  if (target.closest('#top-rated')) {
    tvShows.append(loading);
    dbservice.getTopRated().then((responce) => renderCard(responce, target));
  }
  if (target.closest('#popular')) {
    tvShows.append(loading);
    dbservice.getPopular().then((responce) => renderCard(responce, target));
  }
  if (target.closest('#today')) {
    tvShows.append(loading);
    dbservice.getToday().then((responce) => renderCard(responce, target));
  }
  if (target.closest('#week')) {
    tvShows.append(loading);
    dbservice.getWeek().then((responce) => renderCard(responce, target));
  }
  if (target.closest('#search')) {
    tvShowsList.textContent = '';
    tvShowsHead.textContent = '';
    tvShowsHead.style.borderBottom = 'none';
  }
});

//modal window opening
tvShowsList.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {
    preloader.style.display = 'block';
    dbservice
      .getTvShow(card.id)
      .then(
        ({
          poster_path: posterPath,
          name: title,
          genres,
          vote_average: voteAverage,
          overview,
          homepage,
        }) => {
          tvCardImg.src = posterPath
            ? IMG_URL + posterPath
            : './img/no-poster.jpg';
          tvCardImg.alt = title;
          modalTitle.textContent = title;
          // genresList.innerHTML = data.genres.reduce(
          //   (acc, item) => `${acc}<li>${item.name}</li>`,
          //   ''
          // );
          genresList.textContent = '';
          for (const item of genres) {
            genresList.innerHTML += `<li>${item.name}</li>`;
          }
          // data.genres.forEach(item => {
          //   genresList.innerHTML += `<li>${item.name}</li>`;
          // });
          rating.textContent = voteAverage;
          description.textContent = overview;
          modalLink.href = homepage;
        }
      )
      .then(() => {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
      })
      .finally(() => {
        preloader.style.display = 'none';
      });
  }
});

//modal window closing
modal.addEventListener('click', (event) => {
  if (
    event.target.closest('.cross') ||
    event.target.classList.contains('modal')
  ) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
});

//change the shows image when hovering
const changeImage = (event) => {
  const target = event.target;
  if (target.matches('.tv-card__img')) {
    if (target.dataset.backdrop) {
      [target.src, target.dataset.backdrop] = [
        target.dataset.backdrop,
        target.src,
      ];
    }
  }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);

pagination.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains('pages')) {
    tvShows.append(loading);
    dbservice.getNextPage(target.textContent).then(renderCard);
  }
});

// ****************************************
// const Human = class {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   run() {
//     console.log(this.name + ' go');
//   }

//   sleep() {
//     console.log(`${this.name} sleep`);
//   }
// };

// const mike = new Human('Mike', 43);
// ****************************************

//debugger
