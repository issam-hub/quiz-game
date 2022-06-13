let question = document.querySelector(".question");
let answers = document.querySelectorAll(".answer");
answers = Array.from(answers);

let score = document.querySelector(".score");
let remainingQs = document.querySelector(".remainQ span");

let scoreCount = 0;
let remainQCount = 10;

let reaction = document.querySelector(".reaction img");

let ending = document.querySelector(".theEnd");
let replayBtn = document.querySelector("button");

// while we didn't get data from the API, stop answers from getting clicked
stopClicking(answers, "yes");

fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then((promise) => {
        return promise.json();
    })
    .then((data) => {
        // allow clicking now
        stopClicking(answers, "no");
        let questions = data.results;
        // creating the questions (all functions down below)
        createQuestions(questions, 0);
        let span = document.createElement("span");
        // * this is important in the cases of moving through the questions queue
        span.innerHTML = questions[0].correct_answer;
        answers.forEach((answer) => {
            answer.onclick = (e) => {
                // put the answer in innerHTML so we can get the correct format (cases of html entities)
                span.innerHTML = questions[0].correct_answer;
                // count hom many questions remains
                remainQCount--;
                // when all questions got done, do:
                if (remainQCount === 0) {
                    setTimeout(() => {
                        showingRate();
                    }, 2000);
                    // when the replay button get clicked, reload the page
                    replayBtn.onclick = () => {
                        window.location.reload();
                    };
                }
                remainingQs.textContent = `${remainQCount} / 10`;
                checkAnswer(remainQCount, e.currentTarget, span.innerHTML);
                clearThePage(remainQCount, questions);
            };
        });
    });

// shuffle the answers to hide the correct answer
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createQuestions(questions, index) {
    question.innerHTML = questions[index].question;
    let choices = questions[index].incorrect_answers;
    choices.push(questions[index].correct_answer);
    shuffleArray(choices);
    // put all the answers on there placeholders
    for (let j = 0; j < 4; j++) {
        let p = document.createElement("p");
        p.innerHTML = choices[j];
        answers[j].appendChild(p);
    }
}

function clearThePage(remainQCount, questions) {
    // while there still some questions do:
    if (remainQCount !== 0) {
        stopClicking(answers, "yes");
        setTimeout(() => {
            // clear all the answers placeholders
            document.querySelectorAll(".answer p").forEach((p) => {
                p.remove();
            });
            answers.forEach((a) => {
                // remove green and red for correct/wrong answers
                a.classList.remove("correct");
                a.classList.remove("wrong");
            });
            stopClicking(answers, "no");
            // remove first questions to apply the queue rule (FIFO)
            questions.shift();
            // recreate new question
            createQuestions(questions, 0);
        }, 1500);
    }
}

function stopClicking(answers, state) {
    if (state === "yes") {
        // stop clicking or any events
        answers.forEach((answer) => {
            answer.style.cssText = "pointer-events: none";
        });
    }
    if (state === "no") {
        // allow clicking or any events
        answers.forEach((answer) => {
            answer.style.cssText = "pointer-events: auto";
        });
    }
}

function checkAnswer(remainQCount, element, correctAns) {
    // here the check for -1 so we can display if the answer correct or wrong for the last question
    if (remainQCount !== -1) {
        // if the element doesn't have the correct answer, we are not happy
        if (element.innerHTML.includes(correctAns) === false) {
            onWrongAnswer(element, correctAns);
        }
        // else we happy
        if (element.innerHTML.includes(correctAns)) {
            onCorrectAnswer(element);
        }
    }
}

function onWrongAnswer(element, correctAns) {
    // display red for wrong answer
    element.classList.add("wrong");
    // then display green for the correct answer
    setTimeout(() => {
        answers.forEach((a) => {
            if (a.innerHTML.includes(correctAns)) {
                a.classList.add("correct");
            }
        });
    }, 700);
}

function onCorrectAnswer(element) {
    element.classList.add("correct");
    // increase the score and put it in its placeholder
    scoreCount++;
    score.textContent = `Score: ${scoreCount}`;
}

function rating(score) {
    // display a reaction according to the final score
    switch (score) {
        case "0":
            reaction.src =
                "https://i.giphy.com/media/S8PgGLIp9gHjuE1qcm/giphy.webp";
            break;
        case "1":
            reaction.src = "https://i.giphy.com/media/oTWlzTk9W0uiI/giphy.webp";
            break;
        case "2":
            reaction.src =
                "https://media3.giphy.com/media/3og0IRo1EZPNnhbBV6/giphy.gif?cid=790b7611cfece6958514b075e359d55a46abbff71cf8b75a&rid=giphy.gif&ct=g";
            break;
        case "3":
            reaction.src =
                "https://media4.giphy.com/media/RfAX5iZ7qywFceOIjC/giphy.gif?cid=790b761126d13e2f630a1fe7a14cc95b0a5b85edcee02dbf&rid=giphy.gif&ct=g";
            break;
        case "4":
            reaction.src =
                "https://i.giphy.com/media/SWoRKslHVtqEasqYCJ/giphy.webp";
            break;
        case "5":
            reaction.src =
                "https://i.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.webp";
            break;
        case "6":
            reaction.src =
                "https://i.giphy.com/media/l0MYvV7rbVYm2e1Y4/giphy.webp";
            break;
        case "7":
            reaction.src =
                "https://i.giphy.com/media/3o7bu7zeTINFUjiw0w/giphy.webp";
            break;
        case "8":
            reaction.src = "https://i.giphy.com/media/rSaQxzxmPAGpW/giphy.webp";
            break;
        case "9":
            reaction.src = "https://i.giphy.com/media/Lgcxcl8NFWASY/giphy.webp";
            break;
        case "10":
            reaction.src = "https://i.giphy.com/media/eMu0803X2zkWY/giphy.webp";
            break;
    }
    reaction.style.display = "block";
}

function showingRate() {
    // clear everything and display the reaction
    document.querySelector(".quiz").innerHTML = "";
    remainingQs.parentElement.innerHTML = "";
    score.style.cssText = "z-index: 5; animation: moveBro 3s linear forwards;";
    let rate = score.textContent.match(/\d/gi).join("");
    rating(rate);
    setTimeout(() => {
        downingCurtain();
    }, 1000);
}

function downingCurtain() {
    // make a good ending
    setTimeout(() => {
        ending.style.cssText =
            "display: block; border: 1000px solid rgb(41, 41, 41); animation: ending 5s reverse forwards;";
    }, 1000);
    setTimeout(() => {
        replayBtn.style.display = "block";
    }, 6000);
}
