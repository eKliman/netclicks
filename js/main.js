const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '2e1581dff0a43fe39fff65978ab4df77';
const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal');

//class creation
const DBService = class {
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
};

//render cards
const renderCard = (response) => {
  tvShowsList.textContent = '';
  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg',
      backdropIMG = backdrop ? IMG_URL + backdrop : '',
      voteElem = vote ? '' : ' hide';

    const card = document.createElement('li');
    card.className = 'tv-shows__item';
    // card.classList.add('tv-shows__item');
    card.innerHTML = `
      <a href="#" class="tv-card">
      <span class="tv-card__vote${voteElem}">${vote}</span>
        <img class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}">
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    tvShowsList.append(card);
    // tvShowsList.insertAdjacentElement('afterbegin', card);
    console.log(card);
  });
};

new DBService().getTestData().then(renderCard);

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
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
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
