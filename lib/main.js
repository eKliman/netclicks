'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
var leftMenu = document.querySelector('.left-menu'),
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
var loading = document.createElement('div');
loading.className = 'loading';

//class creation
var DBService = function () {
  function DBService() {
    _classCallCheck(this, DBService);

    this.SERVER = 'https://api.themoviedb.org/3';
    this.API_KEY = '2e1581dff0a43fe39fff65978ab4df77';
  }

  _createClass(DBService, [{
    key: 'getData',
    value: async function getData(url) {
      var res = await fetch(url);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Couldn\'t get the data at ' + url);
      }
    }
  }, {
    key: 'getTestData',
    value: function getTestData() {
      return this.getData('test.json');
    }
  }, {
    key: 'getTestCard',
    value: function getTestCard() {
      return this.getData('card.json');
    }
  }, {
    key: 'getSearchResult',
    value: function getSearchResult(query) {
      this.temp = this.SERVER + '/search/tv?api_key=' + this.API_KEY + '&language=ru-RU&query=' + query;
      return this.getData(this.temp);
    }
  }, {
    key: 'getNextPage',
    value: function getNextPage(page) {
      return this.getData(this.temp + '&page=' + page);
    }
  }, {
    key: 'getTvShow',
    value: function getTvShow(id) {
      this.getData(this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY + '&language=ru-RU');
    }
  }, {
    key: 'getTopRated',
    value: function getTopRated() {
      this.getData(this.SERVER + '/tv/top_rated?api_key=' + this.API_KEY + '&language=ru-RU');
    }
  }, {
    key: 'getPopular',
    value: function getPopular() {
      this.getData(this.SERVER + '/tv/popular?api_key=' + this.API_KEY + '&language=ru-RU');
    }
  }, {
    key: 'getToday',
    value: function getToday() {
      this.getData(this.SERVER + '/tv/airing_today?api_key=' + this.API_KEY + '&language=ru-RU');
    }
  }, {
    key: 'getWeek',
    value: function getWeek() {
      this.getData(this.SERVER + '/tv/on_the_air?api_key=' + this.API_KEY + '&language=ru-RU');
    }
  }]);

  return DBService;
}();

var dbservice = new DBService();

//closing drop-down items when exit the menu
var closeDropdown = function closeDropdown() {
  dropdown.forEach(function (item) {
    item.classList.remove('active');
  });
};

//render cards
var renderCard = function renderCard(response, target) {
  tvShowsList.textContent = '';

  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено ...';
    tvShowsHead.style.cssText = 'color: red; border-bottom: 2px solid red';
    return;
  }
  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
  tvShowsHead.style.cssText = 'color: black; border-bottom: 2px solid gray';
  response.results.forEach(function (item) {
    var backdrop = item.backdrop_path,
        title = item.name,
        poster = item.poster_path,
        vote = item.vote_average,
        id = item.id;


    var posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg',
        backdropIMG = backdrop ? IMG_URL + backdrop : '',
        voteElem = vote ? '<span class="tv-card__vote">' + vote + '</span>' : '';

    var card = document.createElement('li');
    card.idTV = id;
    card.className = 'tv-shows__item';
    // card.classList.add('tv-shows__item');
    card.innerHTML = '\n      <a href="#" id="' + id + '" class="tv-card">\n        ' + voteElem + '\n        <img class="tv-card__img"\n          src="' + posterIMG + '"\n          data-backdrop="' + backdropIMG + '"\n          alt="' + title + '">\n        <h4 class="tv-card__head">' + title + '</h4>\n      </a>\n    ';

    loading.remove();
    tvShowsList.append(card);
    // tvShowsList.insertAdjacentElement('afterbegin', card);
  });

  pagination.textContent = '';
  if (!target && response.total_pages > 1) {
    for (var i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += '<li><a href="#" class="pages">' + i + '</a></li>';
    }
  }
};

//server search query
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  tvShows.append(loading);
  var value = searchFormInput.value.trim();
  if (value) {
    dbservice.getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = '';
});

//menu opening/closing
hamburger.addEventListener('click', function () {
  closeDropdown();
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

//close the menu by clicking outside of it
document.addEventListener('click', function (event) {
  var target = event.target;
  if (!target.closest('.left-menu')) {
    closeDropdown();
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

//drop-down menu implamintation
leftMenu.addEventListener('click', function (event) {
  event.preventDefault();
  var target = event.target;
  var dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }

  if (target.closest('#top-rated')) {
    tvShows.append(loading);
    dbservice.getTopRated().then(function (responce) {
      return renderCard(responce, target);
    });
  }
  if (target.closest('#popular')) {
    tvShows.append(loading);
    dbservice.getPopular().then(function (responce) {
      return renderCard(responce, target);
    });
  }
  if (target.closest('#today')) {
    tvShows.append(loading);
    dbservice.getToday().then(function (responce) {
      return renderCard(responce, target);
    });
  }
  if (target.closest('#week')) {
    tvShows.append(loading);
    dbservice.getWeek().then(function (responce) {
      return renderCard(responce, target);
    });
  }
  if (target.closest('#search')) {
    tvShowsList.textContent = '';
    tvShowsHead.textContent = '';
    tvShowsHead.style.borderBottom = 'none';
  }
});

//modal window opening
tvShowsList.addEventListener('click', function (event) {
  event.preventDefault();
  var target = event.target;
  var card = target.closest('.tv-card');

  if (card) {
    preloader.style.display = 'block';
    dbservice.getTvShow(card.id).then(function (_ref) {
      var posterPath = _ref.poster_path,
          title = _ref.name,
          genres = _ref.genres,
          voteAverage = _ref.vote_average,
          overview = _ref.overview,
          homepage = _ref.homepage;

      tvCardImg.src = posterPath ? IMG_URL + posterPath : './img/no-poster.jpg';
      tvCardImg.alt = title;
      modalTitle.textContent = title;
      // genresList.innerHTML = data.genres.reduce(
      //   (acc, item) => `${acc}<li>${item.name}</li>`,
      //   ''
      // );
      genresList.textContent = '';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = genres[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          genresList.innerHTML += '<li>' + item.name + '</li>';
        }
        // data.genres.forEach(item => {
        //   genresList.innerHTML += `<li>${item.name}</li>`;
        // });
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      rating.textContent = voteAverage;
      description.textContent = overview;
      modalLink.href = homepage;
    }).then(function () {
      document.body.style.overflow = 'hidden';
      modal.classList.remove('hide');
    }).finally(function () {
      preloader.style.display = 'none';
    });
  }
});

//modal window closing
modal.addEventListener('click', function (event) {
  if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
});

//change the shows image when hovering
var changeImage = function changeImage(event) {
  var target = event.target;
  if (target.matches('.tv-card__img')) {
    if (target.dataset.backdrop) {
      var _ref2 = [target.dataset.backdrop, target.src];
      target.src = _ref2[0];
      target.dataset.backdrop = _ref2[1];
    }
  }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);

pagination.addEventListener('click', function (event) {
  event.preventDefault();
  var target = event.target;
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