import questions from '../data/quiz.json'

export function Quiz() {
  const first = questions[0]

  return `
    <section class="quiz-card section-reveal">
      <div class="quiz-progress"><span id="quiz-progress">1</span>/${questions.length}</div>
      <h2 class="quiz-question" id="quiz-question">${first.question}</h2>
      <div class="quiz-options" id="quiz-options">
        ${first.options.map((option, index) => button(option, index)).join('')}
      </div>
      <p class="quiz-feedback" id="quiz-feedback"></p>
    </section>
  `
}

export function bindQuiz(onComplete) {
  let index = 0

  const questionEl = document.querySelector('#quiz-question')
  const optionsEl = document.querySelector('#quiz-options')
  const progressEl = document.querySelector('#quiz-progress')
  const feedbackEl = document.querySelector('#quiz-feedback')

  if (!questionEl || !optionsEl || !progressEl || !feedbackEl) return

  function renderQuestion() {
    const current = questions[index]
    questionEl.textContent = current.question
    optionsEl.innerHTML = current.options.map((option, optionIndex) => button(option, optionIndex)).join('')
    progressEl.textContent = String(index + 1)
  }

  optionsEl.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-option]')
    if (!target) return

    const current = questions[index]
    const selected = Number(target.dataset.option)
    const isCorrect = selected === current.answer

    feedbackEl.textContent = isCorrect ? 'Correct' : 'Not quite'

    window.setTimeout(() => {
      index += 1
      if (index >= questions.length) {
        feedbackEl.textContent = 'Quiz completed. Enhanced mode unlocked.'
        onComplete()
        optionsEl.innerHTML = ''
        return
      }
      feedbackEl.textContent = ''
      renderQuestion()
    }, 350)
  })

  renderQuestion()
}

function button(label, index) {
  return `<button class="quiz-option" type="button" data-option="${index}">${label}</button>`
}
