const form = document.querySelector('form')
const scoreContainer = document.querySelector('.user-score-container')
const score = document.getElementById('score')
const submitButton = document.querySelector('#submit-btn')
const scrollButton = document.querySelector('#scroll-btn')
const reviewButton = document.querySelector('#review-btn')
const maxPageHeight = document.body.offsetHeight

const state = {
	quizAnswersObjectReady: false,
	quizAnswers: null,
	userHitSequence: [],
	userHitPercentage: 0
}

const request = new XMLHttpRequest()

request.addEventListener("readystatechange", () => {
	if (request.readyState === 4) {
		state.quizAnswers = JSON.parse(request.responseText)
		state.quizAnswersObjectReady = true
	}
})

request.open("GET", "./answers.json")
request.send()


function changeScrollButtonVisibility() {
    const pageBottomIsHided = scrollY < (maxPageHeight / 2)

    pageBottomIsHided ? scrollButtonVisible(true) : scrollButtonVisible(false)
}

function getUserHits() {
    for (const questionNumber in state.quizAnswers) {
        const quizAnswer = state.quizAnswers[questionNumber].option
        const userAnswer = form[`inputQuestion${questionNumber}`].value

        quizAnswer === userAnswer ?
			state.userHitSequence.push(true) : state.userHitSequence.push(false)
    }
}

function getUserScore() {
	const questionsAmount = Object.keys(state.quizAnswers).length
    const hitValue = 100 / questionsAmount

	state.userHitPercentage = state.userHitSequence.reduce((acumulator, answerIsCorrect) =>
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

    state.userHitSequence.forEach((correctAnswer, index) => {
        const targetQuestion = form.querySelector(`.question${index +1}`)
        const feedbackText = state.quizAnswers[index +1].feedback

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

	switch (state.userHitPercentage) {
		case 0:
			return setMessage("Errou tudo 😭")
		case 10:
		case 20:
		case 30:
			return setMessage("Legal 😉")
		case 40:
		case 50:
		case 60:
			return setMessage("Bacana! 😘")
		case 70:
		case 80:
		case 90:
			return setMessage("Muito bem! 😍")
		default:
			setMessage("Perfeito! 😱")
	}
}

function animateUserScore() {
    let counter = 0

	const timer = setInterval(()=> {
		counter === state.userHitPercentage ?
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

function processQuizResult() {
    scroll('toTop')
    getUserHits()
    getUserScore()
    processFeedbacks()
    scoreWindowVisible(true)
    printScoreMessage()
    animateUserScore()
}

function checkQuizAnswersObject(_) {
	_.preventDefault()

	if (state.quizAnswersObjectReady) {
		processQuizResult()
	}
}

form.addEventListener('submit', e => checkQuizAnswersObject(e))

document.addEventListener('scroll', () => changeScrollButtonVisibility())

scrollButton.addEventListener('click', () => scroll('toBottom'))

reviewButton.addEventListener('click', () => scoreWindowVisible(false))