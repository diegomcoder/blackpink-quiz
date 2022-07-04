const   QUESTIONS = document.querySelectorAll('.question'),
        score_container = document.querySelector('.user-score-container'),
        score_window = document.querySelector('.score-window'),
        submit_btn = document.querySelector('button[type="submit"]'),
        scroll_btn = document.querySelector('#scroll-btn'),
        review_btn = document.querySelector('#review-btn'),
        page_height = document.body.offsetHeight,
        score = document.getElementById('score')

import json from './answers.json' assert {type: 'json'}

let user_hit_percentage = 0

function uncheck_checkboxes(checkboxes) {

    checkboxes.forEach(_ => _.checked = false)

}

function change_chosen_option(question) {

    const   current_checkboxes = question.currentTarget.querySelectorAll('input[type=checkbox]'),
            clicked_checkbox = question.target

    uncheck_checkboxes(current_checkboxes)
    
    clicked_checkbox.checked = true

}

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

function get_checked_option_by_user(options) {

    let user_option = null

    for (let i = 0; i < options.length; i++) {

        const   current_option_is_checked = options[i].checked === true,
                option_value = options[i].value

        if (current_option_is_checked) {
            
            user_option = option_value

            break
        }

    }

    return user_option
}

function validate_user_answer_and_get_feedback() {

    for (const question in json) {

        const   number = question,
                options = document.querySelectorAll(`.question${number} input[type=checkbox]`),
                current_question = document.querySelector(`.question${question}`),
                number_of_questions = QUESTIONS.length,
                correct_option_percentual_value = Math.round(100 / number_of_questions);

        get_checked_option_by_user(options)

        const   feedback_paragraph = document.createElement('p'),
                user_answer = get_checked_option_by_user(options),
                quiz_answer = json[question].option,
                question_feedback = json[question].answer

        let     answer_status = '🟢 CORRETO: '

        if (quiz_answer == user_answer) {

            feedback_paragraph.setAttribute('class','correct')            

            user_hit_percentage += correct_option_percentual_value
            
        } else {

            feedback_paragraph.classList.remove('correct')

            answer_status = '🔴 ERRADO: '
        }

        feedback_paragraph.textContent = answer_status + question_feedback

        current_question.appendChild(feedback_paragraph)
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

    validate_user_answer_and_get_feedback()

    score_container.classList.remove('d-none')

    animate_user_score()

}

function when_the_user_check_answers(question) {

    question.oninput = change_chosen_option

}

QUESTIONS.forEach(when_the_user_check_answers)

document.onscroll = show_or_hide_scroll_btn

scroll_btn.onclick = scroll_to_bottom

submit_btn.onclick = process_quiz_result

review_btn.onclick = hide_score_window