import { SubjectQuizScore, QuizQuestion } from './quizData'
import { QuizEngine } from './quizEngine'

export interface VideoRecommendation {
  title: string
  channelName: string
  subject: string
  topic: string
  youtubeSearchUrl: string
  youtubeChannelUrl: string
  description: string
  estimatedDuration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  thumbnailColor: string
}

export const CURATED_CHANNELS: Record<string, { name: string, channelUrl: string, subjects: string[], description: string }[]> = {

  biology: [
    { name: 'Armando Hasudungan', channelUrl: 'https://www.youtube.com/@armandohasudungan', subjects: ['biology'], description: 'Detailed hand-drawn medical and biology illustrations' },
    { name: 'Professor Dave Explains', channelUrl: 'https://www.youtube.com/@ProfessorDaveExplains', subjects: ['biology', 'chemistry'], description: 'Clear, comprehensive science explanations' },
    { name: 'Crash Course Biology', channelUrl: 'https://www.youtube.com/@crashcourse', subjects: ['biology'], description: 'Fast-paced, engaging biology overviews' },
    { name: 'Ninja Nerd Science', channelUrl: 'https://www.youtube.com/@NinjaNerdScience', subjects: ['biology'], description: 'Medical-level anatomy and physiology' },
    { name: 'Nucleus Medical Media', channelUrl: 'https://www.youtube.com/@NucleusMedicalMedia', subjects: ['biology'], description: '3D medical animations of biological processes' },
  ],

  chemistry: [
    { name: 'Tyler DeWitt', channelUrl: 'https://www.youtube.com/@tylerdewitt', subjects: ['chemistry'], description: 'Fun, accessible chemistry from basics to advanced' },
    { name: 'The Organic Chemistry Tutor', channelUrl: 'https://www.youtube.com/@TheOrganicChemistryTutor', subjects: ['chemistry', 'maths', 'physics'], description: 'Extensive problem-solving and concept explanations' },
    { name: 'Crash Course Chemistry', channelUrl: 'https://www.youtube.com/@crashcourse', subjects: ['chemistry'], description: 'Engaging overviews of chemistry topics' },
    { name: 'Professor Dave Explains', channelUrl: 'https://www.youtube.com/@ProfessorDaveExplains', subjects: ['chemistry', 'biology'], description: 'Thorough science explanations' },
    { name: 'NileRed', channelUrl: 'https://www.youtube.com/@NileRed', subjects: ['chemistry'], description: 'Real lab chemistry experiments and explanations' },
  ],

  physics: [
    { name: '3Blue1Brown', channelUrl: 'https://www.youtube.com/@3blue1brown', subjects: ['physics', 'maths'], description: 'Beautiful visual mathematics and physics' },
    { name: 'MinutePhysics', channelUrl: 'https://www.youtube.com/@minutephysics', subjects: ['physics'], description: 'Quick, clear physics explanations' },
    { name: 'Veritasium', channelUrl: 'https://www.youtube.com/@veritasium', subjects: ['physics'], description: 'Deep physics concepts and fascinating phenomena' },
    { name: 'Michel van Biezen', channelUrl: 'https://www.youtube.com/@MichelvanBiezen', subjects: ['physics', 'maths'], description: 'Step-by-step physics problem solving' },
    { name: 'The Organic Chemistry Tutor', channelUrl: 'https://www.youtube.com/@TheOrganicChemistryTutor', subjects: ['physics', 'chemistry', 'maths'], description: 'Hundreds of worked physics examples' },
  ],

  maths: [
    { name: '3Blue1Brown', channelUrl: 'https://www.youtube.com/@3blue1brown', subjects: ['maths', 'physics'], description: 'Visual, intuitive mathematics — calculus, linear algebra, more' },
    { name: 'Khan Academy', channelUrl: 'https://www.youtube.com/@khanacademy', subjects: ['maths', 'physics', 'chemistry'], description: 'Free, comprehensive curriculum from basics to advanced' },
    { name: 'blackpenredpen', channelUrl: 'https://www.youtube.com/@blackpenredpen', subjects: ['maths'], description: 'Fast-paced calculus and algebra problem solving' },
    { name: 'PatrickJMT', channelUrl: 'https://www.youtube.com/@patrickjmt', subjects: ['maths'], description: 'Clear step-by-step math tutorials' },
    { name: 'Professor Leonard', channelUrl: 'https://www.youtube.com/@ProfessorLeonard', subjects: ['maths'], description: 'Full university-level math courses (calculus 1,2,3)' },
  ],

  programming: [
    { name: 'CS Dojo', channelUrl: 'https://www.youtube.com/@CSDojo', subjects: ['programming'], description: 'Data structures, algorithms, and coding concepts' },
    { name: 'Fireship', channelUrl: 'https://www.youtube.com/@Fireship', subjects: ['programming'], description: 'Fast, fun modern programming concepts' },
    { name: 'CS50 Harvard', channelUrl: 'https://www.youtube.com/@cs50', subjects: ['programming'], description: 'World-class intro to computer science' },
    { name: 'William Fiset', channelUrl: 'https://www.youtube.com/@WilliamFiset-videos', subjects: ['programming'], description: 'Data structures and algorithms in depth' },
    { name: 'Tech With Tim', channelUrl: 'https://www.youtube.com/@TechWithTim', subjects: ['programming'], description: 'Python, algorithms, and programming projects' },
  ],
}

const THUMBNAIL_COLORS: Record<string, string> = {
  biology: '#065F46', 
  chemistry: '#1E3A5F', 
  physics: '#78350F', 
  maths: '#3B0764', 
  programming: '#4C1D95'
}

export function generateRecommendations(
  weakTopicQueries: string[],
  subject: string,
  score: SubjectQuizScore
): VideoRecommendation[] {
  const recommendations: VideoRecommendation[] = []
  const seenUrls = new Set<string>()
  const channels = CURATED_CHANNELS[subject] || []

  // Helper to get random channels
  const getRandomChannels = (count: number) => {
    return QuizEngine.shuffleArray(channels).slice(0, count)
  }

  // Generate recommendations for weak topics
  weakTopicQueries.forEach(query => {
    const searchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query)
    
    if (!seenUrls.has(searchUrl)) {
      seenUrls.add(searchUrl)
      
      const selectedChannels = getRandomChannels(2)
      
      // Determine topic name from query heuristically
      const topic = query.split(' ').slice(0, 3).join(' ') + '...'
      
      const titleParts = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1))
      const title = titleParts.join(' ')
      
      let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
      if (score.percentage < 40) difficulty = 'beginner'
      else if (score.percentage >= 70) difficulty = 'advanced'

      selectedChannels.forEach(channel => {
        recommendations.push({
          title: title,
          channelName: channel.name,
          subject: subject,
          topic: topic,
          youtubeSearchUrl: searchUrl,
          youtubeChannelUrl: channel.channelUrl,
          description: 'Covers ' + query + ' with examples and visual explanations',
          estimatedDuration: '10-20 min',
          difficulty: difficulty,
          thumbnailColor: THUMBNAIL_COLORS[subject] || '#334155'
        })
      })
    }
  })

  // Deduplicate before adding channel generic recommendations
  const uniqueRecs = Array.from(new Map(recommendations.map(item => [item.youtubeSearchUrl + item.channelName, item])).values())

  return uniqueRecs
}

export function getChannelsForSubject(subject: string) {
  return CURATED_CHANNELS[subject] ?? []
}
