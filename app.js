const   score_container = document.querySelector('.user-score-container'),
        score_window = document.querySelector('.score-window'),
        submit_btn = document.querySelector('button[type="submit"]'),
        scroll_btn = document.querySelector('#scroll-btn'),
        review_btn = document.querySelector('#review-btn'),
        page_height = document.body.offsetHeight,
        score = document.getElementById('score'),
        form = document.querySelector('form')

import quizAnswers from './answers.json' assert {type: 'json'}

let user_hit_percentage = 0

function hide_score_window() {

    score_window.classList.remove('big')

    submit_btn.disabled = true

    setTimeout(()=> score_container.classList.add('d-none'), 201)

}

function scroll_to_bottom() {

    scrollTo({
        top: page_height,
        left: 0,
        behavior: "smooth"
    })

}

function scroll_to_top() {

    scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })

}

function show_or_hide_scroll_btn() {

    const page_bottom_is_hided = scrollY < (page_height / 1.5)

    if (page_bottom_is_hided)

        scroll_btn.classList.remove('d-none')

    else

        scroll_btn.setAttribute('class', 'd-none')

}

function getUserScore() {

    const questionsAmount = Object.keys(quizAnswers).length

    for (const question in quizAnswers) {

        const quizAnswer = quizAnswers[question].option
        const userAnswer = form[`inputQuestion${question}`].value

        if (quizAnswer === userAnswer)
            user_hit_percentage += 100 / questionsAmount
    }

}

function printFeedback() {

    const status = {
        correct: "🟢 CORRETO: ",
        wrong: "🔴 ERRADO: "
    }

    for (const question in quizAnswers) {

        const quizAnswer = quizAnswers[question].option
        const userAnswer = form[`inputQuestion${question}`].value

        const paragraph = document.createElement('p')

        const feedback = quizAnswers[question].answer
        const currentQuestion = form.querySelector(`.question${question}`)

        if (quizAnswer === userAnswer) {
            paragraph.textContent = status.correct + feedback
            paragraph.setAttribute('class','correct')
        } else {
            paragraph.textContent = status.wrong + feedback
            paragraph.classList.remove('correct')
        }

        currentQuestion.appendChild(paragraph)
    }

}

function animate_user_score() {

    setTimeout(()=> {

        score_window.classList.add('big')

        let counter = 0

        const timer = setInterval(()=> {

            if (counter === user_hit_percentage) {

                return clearInterval(timer)

            }

            score.innerText = `${++counter}%`

        }, 30)

    }, 10)

}

function process_quiz_result(event) {

    event.preventDefault()

    scroll_to_top()

    getUserScore()

    printFeedback()

    score_container.classList.remove('d-none')

    animate_user_score()

}

document.onscroll = show_or_hide_scroll_btn

scroll_btn.onclick = scroll_to_bottom

submit_btn.onclick = process_quiz_result

review_btn.onclick = hide_score_window