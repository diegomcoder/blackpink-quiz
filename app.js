const form = document.querySelector('form')
const scoreContainer = document.querySelector('.user-score-container')
const score = document.getElementById('score')

const submitButton = document.querySelector('#submit-btn')
const scrollButton = document.querySelector('#scroll-btn')
const reviewButton = document.querySelector('#review-btn')

const maxPageHeight = document.body.offsetHeight

const userHitSequence = []

/****** QUIZ ANSWERS ******/
import quizAnswersObject from './answers.json' assert {type: 'json'}

let userHitPercentage = 0

function changeScrollButtonVisibility() {
    const pageBottomIsHided = scrollY < (maxPageHeight / 2)

    pageBottomIsHided ? scrollButtonVisible(true) : scrollButtonVisible(false)
}

function getUserHits() {
    for (const questionNumber in quizAnswersObject) {
        const quizAnswer = quizAnswersObject[questionNumber].option
        const userAnswer = form[`inputQuestion${questionNumber}`].value

        quizAnswer === userAnswer ?
			userHitSequence.push(true) : userHitSequence.push(false)
    }
}

function getUserScore() {
	const questionsAmount = Object.keys(quizAnswersObject).length
    const hitValue = 100 / questionsAmount

	userHitPercentage = userHitSequence.reduce((acumulator, answerIsCorrect) =>
		answerIsCorrect ? acumulator += hitValue : acumulator, 0)
}

function addFeedback(status, feedback, target) {
	const newParagraph = document.createElement('p')

	newParagraph.textContent = status + feedback
	newParagraph.setAttribute('class','correct')

	target.appendChild(newParagraph)
}

function processFeedbacks() {
    const status = {
        correct: "🟢 CORRETO: ",
        wrong: "🔴 ERRADO: "
    }

    userHitSequence.forEach((correctAnswer, index) => {
        const targetQuestion = form.querySelector(`.question${index +1}`)
        const feedbackText = quizAnswersObject[index +1].feedback

        correctAnswer ?
            addFeedback(status.correct, feedbackText, targetQuestion)
        :	addFeedback(status.wrong, feedbackText, targetQuestion)
    })
}

function printScoreMessage() {
    const scoreMessageContainer = document.getElementById('score-message')

    function setMessage(message) {
        return scoreMessageContainer.textContent = message
    }

    const scoreMessage = {
        1: "Errou tudo 😭",
        2: "Legal 😉",
        3: "Bacana! 😘",
        4: "Muito bem! 😍",
        5: "Perfeito! 😱"
    }

	switch (userHitPercentage) {
		case 0:
			return setMessage(scoreMessage[1])
		case 10:
		case 20:
		case 30:
			return setMessage(scoreMessage[2])
		case 40:
		case 50:
		case 60:
			return setMessage(scoreMessage[3])
		case 70:
		case 80:
		case 90:
			return setMessage(scoreMessage[4])
		default:
			setMessage(scoreMessage[5])
	}
}

function animateUserScore() {
    let counter = 0

	const timer = setInterval(()=> {
		counter === userHitPercentage ?
			clearInterval(timer) : score.innerText = `${++counter}%`

	}, 30)
}

function scroll(direction) {
	if (direction === 'toTop') {
		return scrollTo({ top: 0, left: 0, behavior: "smooth" })
	}

	scrollTo({ top: maxPageHeight, left: 0, behavior: "smooth" })
}

function scrollButtonVisible(visible) {
	if (visible) {
		return scrollButton.classList.remove('d-none')
	}

	scrollButton.setAttribute('class', 'd-none')
}

function scoreWindowVisible(visible) {
	if (visible) {
		return scoreContainer.classList.remove('d-none')
	}

	submitButton.disabled = true
	scoreContainer.classList.add('review')
	setTimeout(()=> scoreContainer.classList.add('d-none'), 210)
}

function processQuizResult(_) {
    _.preventDefault()

    scroll('toTop')
    getUserHits()
    getUserScore()
    processFeedbacks()
    scoreWindowVisible(true)
    printScoreMessage()
    animateUserScore()
}

form.addEventListener('submit', event => processQuizResult(event))

document.addEventListener('scroll', () => changeScrollButtonVisibility())

scrollButton.addEventListener('click', () => scroll('toBottom'))

reviewButton.addEventListener('click', () => scoreWindowVisible(false))