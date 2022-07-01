const   QUESTIONS = document.querySelectorAll('.question'),
        scoreContainer = document.querySelector('.user-score-container'),
        score_window = document.querySelector('.score-window'),
        submit_btn = document.querySelector('button[type="submit"]'),
        scroll_btn = document.querySelector('#scroll-btn'),
        review_btn = document.querySelector('#review-btn'),
        pageHeight = document.body.offsetHeight,
        score = document.getElementById('score')


const uncheckCheckboxes = checkboxes => {
    checkboxes.forEach(checkbox => checkbox.checked = false)
}

import json from './answers.json' assert {type: 'json'}

let hitPercentage = 0

const verifyCheck = question => {

    const options = question.querySelectorAll('input')
    let checked = false

    options.forEach(option => option.addEventListener('change', elemChanged => {
        const   text = elemChanged.target.parentElement.textContent,
                checkbox = elemChanged.target

        uncheckCheckboxes(options)

        checkbox.checked = true
    }))
}

QUESTIONS.forEach(question => verifyCheck(question))

const processQuizResult = sub => {
    sub.preventDefault()

    scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })

    for (const question in json){
        const   number = question,
                options = document.querySelectorAll(`.question${number} input[type=checkbox]`),
                currentQuestion = document.querySelector(`.question${question}`),
                questionExplanation = currentQuestion.querySelector('p'),
                numberOfQuestions = QUESTIONS.length,
                correctOptionPercentualValue = Math.round(100 / numberOfQuestions)

        function getCheckedOption() {

            let checkedOption = null

            for (let i = 0; i < options.length; i++) {
    
                if (options[i].checked === true) {
                    
                    checkedOption = options[i].value
                    break
                }
            }

            return checkedOption
        }
        
        const userAnswer = getCheckedOption()

        if (json[question].option == userAnswer) {

            questionExplanation.setAttribute('class','correct')

            hitPercentage += correctOptionPercentualValue
            
        } else {
            questionExplanation.classList.remove('correct')
        }

        questionExplanation.textContent = json[question].answer
    }

    scoreContainer.classList.remove('d-none')

    setTimeout(()=> {

        score_window.classList.add('big')

        let counter = 0

        const timer = setInterval(()=> {

            if (counter === hitPercentage) {
                return clearInterval(timer)
            }

            score.innerText = `${++counter}%`

        }, 30)

    }, 10)

}

const hideScoreWindow = () => {

    score_window.classList.remove('big')
    submit_btn.disabled = true

    setTimeout(()=> scoreContainer.classList.add('d-none'), 201)

}

scroll_btn.onclick = () => {

    scrollTo({
        top: pageHeight,
        left: 0,
        behavior: "smooth"
    })

}

document.onscroll = ()=> {
    if (scrollY < (pageHeight / 2)) {
        scroll_btn.classList.remove('d-none')
    } else {
        scroll_btn.setAttribute('class', 'd-none')
    }
}

submit_btn.onclick = processQuizResult

review_btn.onclick = hideScoreWindow