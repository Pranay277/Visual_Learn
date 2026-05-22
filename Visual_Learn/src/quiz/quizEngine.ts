import { QuizQuestion, QuizResult, SubjectQuizScore } from './quizData'

export class QuizEngine {
  private results: QuizResult[] = []
  private startTime: number = 0
  private currentQuestionStartTime: number = 0

  startSession(): void {
    this.startTime = Date.now()
    this.results = []
  }

  startQuestion(): void {
    this.currentQuestionStartTime = Date.now()
  }

  submitAnswer(question: QuizQuestion, selectedOptionId: string | null): QuizResult {
    const timeSpentSeconds = Math.round((Date.now() - this.currentQuestionStartTime) / 1000)
    
    const result: QuizResult = {
      questionId: question.id,
      topic: question.topic,
      subject: question.subject,
      correct: question.correctOptionId === selectedOptionId,
      timeSpentSeconds
    }
    
    this.results.push(result)
    return result
  }

  getResults(): QuizResult[] {
    return this.results
  }

  computeSubjectScore(subject: string): SubjectQuizScore {
    const subjectResults = this.results.filter(r => r.subject === subject)
    const totalQuestions = subjectResults.length
    const correctAnswers = subjectResults.filter(r => r.correct).length
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    // Group by topic
    const topicStats: Record<string, { total: number, correct: number }> = {}
    subjectResults.forEach(r => {
      if (!topicStats[r.topic]) {
        topicStats[r.topic] = { total: 0, correct: 0 }
      }
      topicStats[r.topic].total += 1
      if (r.correct) topicStats[r.topic].correct += 1
    })

    const weakTopics: string[] = []
    const strongTopics: string[] = []

    for (const [topic, stats] of Object.entries(topicStats)) {
      const topicPercentage = (stats.correct / stats.total) * 100
      if (topicPercentage < 60) {
        weakTopics.push(topic)
      } else if (topicPercentage >= 80) {
        strongTopics.push(topic)
      }
    }

    return {
      subject,
      totalQuestions,
      correctAnswers,
      percentage,
      weakTopics,
      strongTopics
    }
  }

  computeAllScores(): SubjectQuizScore[] {
    const subjects = new Set(this.results.map(r => r.subject))
    const scores: SubjectQuizScore[] = []
    for (const subject of Array.from(subjects)) {
      scores.push(this.computeSubjectScore(subject))
    }
    return scores
  }

  getWeakTopicsForSubject(subject: string): string[] {
    return this.computeSubjectScore(subject).weakTopics
  }

  getYoutubeQueriesForWeakTopics(subject: string, questions: QuizQuestion[]): string[] {
    const weakTopics = this.getWeakTopicsForSubject(subject)
    const queries = new Set<string>()
    
    questions.forEach(q => {
      if (q.subject === subject && weakTopics.includes(q.topic)) {
        queries.add(q.youtubeSearchQuery)
      }
    })
    
    return Array.from(queries)
  }

  resetSession(): void {
    this.results = []
    this.startTime = 0
    this.currentQuestionStartTime = 0
  }

  static selectQuestionsForSubject(
    subject: string,
    questions: QuizQuestion[],
    count: number = 10
  ): QuizQuestion[] {
    const subjectQuestions = questions.filter(q => q.subject === subject)
    // Fisher-Yates shuffle
    const shuffled = QuizEngine.shuffleArray(subjectQuestions)
    return shuffled.slice(0, count)
  }

  static shuffleArray<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
}

export const quizEngine = new QuizEngine()
