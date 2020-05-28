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
  searchFormInput = document.querySelector('.search__form-input');

//div creation for animated bootloader
const loading = document.createElement('div');
loading.className = 'loading';

//class creation
const DBService = class {
  constructor() {
    this.SERVER = 'https://api.themoviedb.org/3';
    this.API_KEY = '2e1581dff0a43fe39fff65978ab4df77';
  }

  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Couldn't get the data at ${url}`);
    }
  };
  getTestData = () => {
    return this.getData('test.json');
  };
  getTestCard = () => {
    return this.getData('card.json');
  };
  getSearchResult = (query) => {
    return this.getData(
      `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`
    );
  };
  getTvShow = (id) =>
    this.getData(
      this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY + '&language=ru-RU'
    );
};

//render cards
const renderCard = (response) => {
  tvShowsList.textContent = '';

  if (!response.total_results) {
    tvShowsList.textContent = 'По вашему запросу сериалов не найдено';
    loading.remove();
  }
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
};

//server search query
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = '';
});

//menu opening/closing
hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

//close the menu by clicking outside of it
document.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.closest('.left-menu')) {
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
});

//modal window opening
tvShowsList.addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {
    preloader.style.display = 'block';
    new DBService()
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
        preloader.style.display = 'none';
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
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
