const form = document.querySelector('form')
const scoreContainer = document.querySelector('.user-score-container')

const submitButton = document.querySelector('#submit-btn')
const scrollButton = document.querySelector('#scroll-btn')
const reviewButton = document.querySelector('#review-btn')


import quizAnswersObject from './answers.json' assert {type: 'json'}

const userHitSequence = []
let userHitPercentage = 0

const pageHeight = document.body.offsetHeight

function scrollToBottom() {

    scrollTo({
        top: pageHeight,
        left: 0,
        behavior: "smooth"
    })

}

function scrollToTop() {

    scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })

}

function changeScrollButtonVisibility() {

    function showScrollBtn() {
        scrollButton.classList.remove('d-none')
    }
    
    function HideScrollBtn() {
        scrollButton.setAttribute('class', 'd-none')
    }

    const pageBottomIsHided = scrollY < (pageHeight / 2)

    pageBottomIsHided ? showScrollBtn() : HideScrollBtn()
}

function getUserHits() {

    for (const questionNumber in quizAnswersObject) {

        const quizAnswer = quizAnswersObject[questionNumber].option
        const userAnswer = form[`inputQuestion${questionNumber}`].value

        if (quizAnswer === userAnswer)
            userHitSequence.push(true)
        else
            userHitSequence.push(false)
    }
}

function getUserScore() {
    let points = 0

    userHitSequence.forEach(correctResult => {
        correctResult ? points++ : null
    })

    const questionsAmount = Object.keys(quizAnswersObject).length
    const hitValue = 100 / questionsAmount

    userHitPercentage = points * hitValue
}

function processFeedbacks() {

    const status = {
        correct: "🟢 CORRETO: ",
        wrong: "🔴 ERRADO: "
    }

    userHitSequence.forEach((correctAnswer, index) => {
        const targetQuestion = form.querySelector(`.question${index +1}`)
        const feedbackText = quizAnswersObject[index +1].feedback

        if (correctAnswer) {
            addFeedback(status.correct, feedbackText, targetQuestion)
        } else {
            addFeedback(status.wrong, feedbackText, targetQuestion)
        }
    })
}

function addFeedback(status, feedback, target) {
    const newParagraph = document.createElement('p')

    newParagraph.textContent = status + feedback
    newParagraph.setAttribute('class','correct')

    target.appendChild(newParagraph)
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

    if (userHitPercentage === 0) {
        setMessage(scoreMessage[1])
    }

    if (userHitPercentage > 0 && userHitPercentage < 30) {
        setMessage(scoreMessage[2])
    }

    if (userHitPercentage > 20 && userHitPercentage < 60) {
        setMessage(scoreMessage[3])
    }

    if (userHitPercentage > 50 && userHitPercentage < 90) {
        setMessage(scoreMessage[4])
    }

    if (userHitPercentage === 100) {
        setMessage(scoreMessage[5])
    }
}

function animateUserScore() {
    const score = document.getElementById('score')

    setTimeout(()=> {

        let counter = 0

        const timer = setInterval(()=> {

            if (counter === userHitPercentage) {

                return clearInterval(timer)

            }

            score.innerText = `${++counter}%`

        }, 30)

    }, 10)

}

function showScoreWindow() {
    scoreContainer.classList.remove('d-none')
}

function hideScoreWindow() {

    submitButton.disabled = true

    scoreContainer.classList.add('review')

    setTimeout(()=> scoreContainer.classList.add('d-none'), 210)

}

function processQuizResult(event) {

    event.preventDefault()

    scrollToTop()

    getUserHits()

    getUserScore()

    processFeedbacks()

    showScoreWindow()

    printScoreMessage()

    animateUserScore()

}

document.onscroll = changeScrollButtonVisibility

scrollButton.onclick = scrollToBottom

submitButton.onclick = processQuizResult

reviewButton.onclick = hideScoreWindow