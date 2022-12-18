(() => {
  // переменные 
  let numberOfCoincidences = 0; // Счетчик совпавших пар
  let firstCard = {}; // Для записи значения первой карточки 
  let secondCard = {}; // Для записи значения второй карточки
  let isEqual = false; // Равенство карточек
  let timer;

  // функция создания  заголовок игры
  function createTitle(title) {
    const appTitle = document.createElement('h1');
    appTitle.innerHTML = title;
    return appTitle;
  }
  // число карт и формирование игры
  function getNumberOfCards() {
    const formContainer = document.querySelector('.header');
    const gameTitle = createTitle('ПАРЫ');
    const numberOfCardsForm = createNumberOfCardsForm();
    formContainer.append(gameTitle);
    formContainer.append(numberOfCardsForm.form);
    numberOfCardsForm.form.addEventListener('submit', (e) => {  // Ввод и проверка чисел на валидность
      e.preventDefault();
      const inputValue = numberOfCardsForm.input.value;
      if (!inputValue) {
        return;
      }
      const validNumber = checkOnValidation(inputValue);
      if (!validNumber) {
        numberOfCardsForm.input.value = '4';
      } else {
        numberOfCardsForm.input.value = '';
        numberOfCardsForm.button.disabled = true;


        timer = setTimeout(() => {
          alert('Время игры закончилось');
          window.location.reload();
        }, 60000);
        startGame(Math.pow(validNumber, 2));
      }
    });
  }

  // Создаем и возвращаем форму для ввода кол-ва карточек
  function createNumberOfCardsForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    form.classList.add('number-card_form');
    form.innerText = 'Укажите количество карточек по вертикали/горизонтали';
    input.classList.add('number-card_input');
    input.type = 'text';
    input.placeholder = 'Введите четное число от 2 до 10';
    button.classList.add('number-card_button');
    button.textContent = 'Начать игру';

    form.append(input);
    form.append(button);

    return {
      form,
      input,
      button,
    };
  }

  function checkOnValidation(numb) {
    if (numb > 1 && numb < 11) {
      if (!(numb % 2)) {
        return numb;
      }
    }
    return null;
  }

  function startGame(cardsCount) { //начало игры, заполнение массива числами
    const arrayCards = [];
    for (let i = 1; i <= cardsCount / 2; i++) {
      arrayCards.push(i);
      arrayCards.push(i);
    }
    const shuffledArray = shuffle(arrayCards);
    createListOfCards(cardsCount, shuffledArray); // Создаем карточки и вешаем обработчик
    let width = Math.sqrt(cardsCount) * 100 + 100;
    document.querySelector('.game').setAttribute('style', 'width:' + width + 'px; height:' + width + 'px');
  }

  function shuffle(array) { // перетасовка
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * i)
      k = array[i]
      array[i] = array[j]
      array[j] = k
    }
    return array;
  }

  function createCardList() {   //  ненумерованный список
    const list = document.createElement('ul');
    list.classList.add('cards_list');
    return list;
  }

  function createCard(idValue) {  // Создает и возвращает карточку с атрибутами


    const card = document.createElement('li');
    const button = document.createElement('button');
    card.classList.add('card');
    card.setAttribute("style", `width: 100px; height: 100px;`);
    button.classList.add('btn');
    button.id = idValue;
    button.setAttribute("style", `font-size: 24px;`)
    card.append(button);
    return {
      card,
      button,
    };
  }


  function createListOfCards(cardsCount, shuffledArray) {
    const section = document.querySelector('.game');
    const listOfCards = createCardList();
    for (let i = 0; i < cardsCount; ++i) {
      let currentCard = createCard(i);
      listOfCards.append(currentCard.card);
      currentCard.button.addEventListener('click', () => {
        let valueOfCard = shuffledArray[currentCard.button.id];
        currentCard.button.innerHTML = valueOfCard;
        comparePairs(currentCard, valueOfCard);
        if (cardsCount === numberOfCoincidences * 2) {  // Проверка на достижение конца игры
          playAgain(); // Функция повтора игры
        }
      });
    }
    section.appendChild(listOfCards);
  }


  function comparePairs(card, value) {  // Сравниваем значения карточек
    if (!Object.keys(firstCard).length) {  // Если значение первой карточки пусто записываем переданное значение в эту карточку
      firstCard = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
    } else if (!Object.keys(secondCard).length) { // Если значение второй карточки пусто записываем переданное значение в эту карточку
      secondCard = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      if (firstCard.value === secondCard.value) {
        isEqual = true;
        numberOfCoincidences++;
        return;
      }
    } else {
      if (!isEqual) {
        firstCard.card.button.innerHTML = '';
        secondCard.card.button.innerHTML = '';
        firstCard.card.button.removeAttribute('disabled');
        secondCard.card.button.removeAttribute('disabled');
      } else {
        isEqual = false;
      }
      firstCard = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      secondCard = {};
    }
  }

  function playAgain() {
    const section = document.querySelector('.game');
    const label = document.createElement('h2');
    const button = document.createElement('button');
    label.innerText = 'ПОБЕДА'
    label.style.color = 'green'
    button.innerText = 'Сыграть ещё раз';
    button.classList.add('btn__down');
    section.append(label);
    section.append(button);
    clearTimeout(timer);
    button.addEventListener('click', () => {
      window.location.reload();
    });
  }


  document.addEventListener('DOMContentLoaded', () => {
    getNumberOfCards();
  });

})();
