import { Section } from '../components/Section.js'
import { Quiz, bindQuiz } from '../components/Quiz.js'

export function render({ t }) {
  return `
    <main class="page-stack">
      ${Section({ id: 'quiz-intro', title: t.quiz.title, body: t.quiz.intro })}
      ${Quiz()}
    </main>
  `
}

export function mount({ onQuizComplete }) {
  bindQuiz(onQuizComplete)
}
