import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://endorsementsdb-73286-default-rtdb.firebaseio.com"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsdb = ref(database, "endorsementsdb");

const endorseInputEl = document.getElementById('endorsement-in');
const fromEl = document.getElementById('from-in');
const toEl = document.getElementById('to-in');
const publishBtn = document.getElementById('publish-btn');
const endorsementul = document.getElementById('endorsement-ul');

let isDisabled = false;

function createListItems(endorseObj, objectID) {

    if (endorseObj) {
        let newListEl = document.createElement('li');

        let newToParaEl = document.createElement('p');
        newToParaEl.id = 'topara';
        newToParaEl.textContent = `To ${endorseObj.to}`;

        newListEl.appendChild(newToParaEl);

        let newEndorseParaEl = document.createElement('p');
        newEndorseParaEl.id = 'endorsepara';
        newEndorseParaEl.textContent = `${endorseObj.endorsement}`;

        newListEl.appendChild(newEndorseParaEl);

        let newBottomDiv = document.createElement('div');
        newBottomDiv.id = 'bottom';

        let newFromParaEl = document.createElement('p');
        newFromParaEl.id = 'frompara';
        newFromParaEl.textContent = `From ${endorseObj.from}`;

        newBottomDiv.appendChild(newFromParaEl);

        let newLikesParaEl = document.createElement('p');
        newLikesParaEl.id = 'likes';

        let newSpanCountEl = document.createElement('span');
        newSpanCountEl.id = 'like-count';
        newSpanCountEl.textContent = `${endorseObj.likesCount}`;

        let newLikesBtnEl = document.createElement('button');
        newLikesBtnEl.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        newLikesBtnEl.id = 'likeBtn';
        newLikesBtnEl.addEventListener('click', function () {

            console.log("clicked once");
            this.disabled = true;
            isDisabled = true;

            endorseObj.likesCount += 1;
            newSpanCountEl.textContent = endorseObj.likesCount
            let dbIdOfItemToUpdateRef = ref(database, `endorsementsdb/${objectID}`);
            set(dbIdOfItemToUpdateRef, endorseObj);
        })

        newLikesParaEl.appendChild(newLikesBtnEl);
        newLikesParaEl.appendChild(newSpanCountEl);

        newBottomDiv.appendChild(newLikesParaEl);

        newListEl.appendChild(newBottomDiv);
        endorsementul.appendChild(newListEl);
    }

}

function displayEndorsements(listItems) {

    endorsementul.innerHTML = "";

    let endorseObj = {};

    for (let i = 0; i < listItems.length; i++) {
        endorseObj = {
            endorsement: listItems[i][1].endorsement,
            from: listItems[i][1].from,
            to: listItems[i][1].to,
            likesCount: listItems[i][1].likesCount
        }

        createListItems(endorseObj, listItems[i][0]);
    }

}

onValue(endorsementsdb, function (snapshot) {

    if (snapshot.exists() && !isDisabled) {
        displayEndorsements(Object.entries(snapshot.val()));
    }
})

function clearInputEl() {
    endorseInputEl.value = "";
    fromEl.value = "";
    toEl.value = "";
}

publishBtn.addEventListener('click', function () {

    isDisabled = false;
    let endorsement = {};
    console.log(endorseInputEl.value);

    if (endorseInputEl.value && fromEl.value && toEl.value) {
        endorsement = {
            endorsement: endorseInputEl.value,
            from: fromEl.value,
            to: toEl.value,
            likesCount: 0
        };
    }

    if (endorsement)
        push(endorsementsdb, endorsement); // this will insert items in DB

    clearInputEl();
})