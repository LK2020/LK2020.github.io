'use strict'

var emoji = ['🐶', '🐱', '🐭', '🦄', '🦁', '🐷', '🐶', '🐱', '🐭', '🦄', '🦁', '🐷'];

var cards = document.querySelector('.cards-field');
var bodyBlackout = document.querySelector('.body-blackout');
var modalWin = document.getElementById("modal-win");
var modalLose = document.getElementById("modal-lose");
var modalButton = document.getElementById("modal-button");
var modalWindow = document.querySelector('.modal-window');

function addOnClickEventListeners() {
    cards.addEventListener('click', clickOnCard);
}

function appendCards() {
    for (var i = 1; i < emoji.length; i++) {
        cards.appendChild(cards.children[0].cloneNode(true));
    }
    addemoji(cards);
}

function clickOnCard() {
    event.stopPropagation();
    var target = event.target;
    if (!(target.classList.contains('front') || target.classList.contains('back'))) {
        return;
    }

    var card = target.parentElement;
    if (card.classList.contains('luck') || card.classList.contains('luck')) {
        return;
    }
    document.querySelectorAll('.card.fail').forEach(function(card) {
        card.classList.remove('open', 'fail');
        card.classList.add('close');
    });

    if (target.classList.contains('back')) {
        card.classList.remove('close');
        card.classList.add('open');
    }

    if (target.classList.contains('front')) {
        card.classList.remove('open', 'fail');
        card.classList.add('close');
    }

    var allOpens = Array.from(document.querySelectorAll('.card.open:not(.luck)'));
    if (allOpens.length === 2) {
        allOpens.forEach(function(element) {
            element.classList.add(isEmojiEqual(allOpens) ? 'luck' : 'fail')
        })
    }
    checkResults();
    timer.start();
}

function checkResults() {
    var opensAndGuessedCount = Array.from(document.querySelectorAll('.card.open.luck')).length;
    if (opensAndGuessedCount === 12) {
        showModalWindow(true);
        timer.stop();
    }
}

function isEmojiEqual(allOpens) {
    return getCardEmoji(allOpens[0]) === getCardEmoji(allOpens[1]);
}



function getCardEmoji(card) {
    return card.children[1].textContent;
}

function addemoji() {
    var newEmoji = emoji.sort(function() { return 0.5 - Math.random() });
    for (var i = 0; i < newEmoji.length; i++) {
        cards.children[i].children[1].textContent = newEmoji[i];
    }
}

function formatTime(time) {
    return formatToTwoDigits(Math.floor(time / 60)) + ":" + formatToTwoDigits(time % 60);
}

function formatToTwoDigits(number) {
    return number < 10 ? "0" + number : number;
}

function showModalWindow(isWin) {
    if (isWin) {
        modalWin.style.display = 'block';
        modalLose.style.display = 'none';
        modalButton.textContent = "Play again";
    } else {
        modalWin.style.display = 'none';
        modalLose.style.display = 'block';
        modalButton.textContent = "Try again";
    }

    modalWindow.classList.add('is-visible');
    bodyBlackout.classList.add('is-not-visible');
}

function hideModalWindow() {
    modalWindow.classList.remove('is-visible');
    bodyBlackout.classList.remove('is-not-visible');
}

var timer = {
    element: document.getElementById("timer"),
    currentValue: 59,
    isWorking: false,
    interval: 0,
    start: function() {
        if (this.isWorking) {
            return;
        }

        this.isWorking = true;

        var self = this;
        this.interval = setInterval(function() {
            if (self.currentValue === 0) {
                showModalWindow(false);
                self.stop();
            }
            self.element.textContent = formatTime(self.currentValue);
            self.currentValue--;
        }, 1000)
    },
    stop: function() {
        clearInterval(this.interval);
    },
    restart: function() {
        this.element.textContent = formatTime(60);
        this.isWorking = false;
        this.currentValue = 59;
    }
}

function restart() {
    Array.from(document.querySelectorAll('.card'))
        .forEach(function(element) {
            element.classList.remove('open');
            element.classList.remove('luck');
            element.classList.remove('fail');
        });
    addemoji();
    hideModalWindow();
    timer.restart();
}

function init() {
    addOnClickEventListeners();
    appendCards();
}