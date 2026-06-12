const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface AIResponse {
  content: string
  error?: string
}

export async function chatCompletion(
  messages: ChatMessage[],
  model: string = "google/gemini-2.0-flash-001"
): Promise<AIResponse> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://magic-ai.app",
        "X-Title": "Magic AI Learning Platform",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("OpenRouter API error:", err)
      return { content: "", error: "AI service error. Please try again." }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""
    return { content }
  } catch (error) {
    console.error("AI completion error:", error)
    return { content: "", error: "Failed to get AI response." }
  }
}

export async function streamChatCompletion(
  messages: ChatMessage[],
  model: string = "google/gemini-2.0-flash-001"
): Promise<ReadableStream> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://magic-ai.app",
      "X-Title": "Magic AI Learning Platform",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error("AI service error")
  }

  return response.body!
}

// Specialized AI functions for Magic AI

export async function solveMathProblem(problem: string): Promise<AIResponse> {
  return chatCompletion([
    {
      role: "system",
      content: `You are Magic AI Math Solver, an expert mathematics tutor. Solve the problem step-by-step in a student-friendly format.
      
Rules:
- Show every step clearly with explanations
- Use simple language that students can understand
- Format math expressions clearly (use Unicode symbols: ×, ÷, √, π, ², ³, etc.)
- Highlight the final answer
- If there are multiple approaches, show the simplest one
- Add a "💡 Tip" at the end with a helpful insight

Format your response using markdown with clear section headers.`,
    },
    { role: "user", content: problem },
  ])
}

export async function answerScienceQuestion(
  subject: string,
  question: string
): Promise<AIResponse> {
  return chatCompletion([
    {
      role: "system",
      content: `You are Magic AI Science Tutor, specialized in ${subject}. Provide detailed, accurate explanations.
      
Rules:
- Give thorough explanations with examples
- Use analogies to make complex concepts simple
- Include real-world applications
- Add practice questions at the end
- Format with clear headers and bullet points
- Use markdown formatting`,
    },
    { role: "user", content: question },
  ])
}

export async function analyzeHomework(
  question: string,
  imageUrl?: string
): Promise<AIResponse> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `You are Magic AI Homework Assistant. Analyze the homework problem and provide a complete solution.
      
Rules:
- Identify the subject and topic
- Break down the problem step-by-step
- Explain the methodology used
- Provide the complete solution with explanations
- Add tips for similar problems
- Format with clear markdown headers`,
    },
  ]

  if (imageUrl) {
    // For image-based homework, we describe what we'd analyze
    messages.push({
      role: "user",
      content: `I've uploaded an image of my homework. The question appears to be: ${question}. Please solve this step-by-step.`,
    })
  } else {
    messages.push({ role: "user", content: question })
  }

  return chatCompletion(messages)
}

export async function generateQuiz(
  topic: string,
  numQuestions: number = 5,
  difficulty: string = "medium",
  questionTypes: string[] = ["multiple_choice", "true_false", "open_ended"]
): Promise<AIResponse> {
  return chatCompletion([
    {
      role: "system",
      content: `You are Magic AI Quiz Generator. Generate a quiz in strict JSON format.

Generate ${numQuestions} questions about "${topic}" at ${difficulty} difficulty level.
Include these question types: ${questionTypes.join(", ")}

IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
{
  "title": "Quiz: [Topic]",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "answer": "A",
      "explanation": "Detailed explanation of why A is correct"
    },
    {
      "id": 2,
      "type": "true_false",
      "question": "Statement to evaluate",
      "options": ["True", "False"],
      "answer": "True",
      "explanation": "Explanation"
    },
    {
      "id": 3,
      "type": "open_ended",
      "question": "Question requiring written answer",
      "answer": "Expected answer key points",
      "explanation": "What a good answer should include"
    }
  ]
}`,
    },
    { role: "user", content: `Generate a ${difficulty} quiz about ${topic} with ${numQuestions} questions` },
  ])
}

export async function createStudyPlan(
  subjects: string[],
  goals: string,
  availableHours: number,
  duration: string
): Promise<AIResponse> {
  return chatCompletion([
    {
      role: "system",
      content: `You are Magic AI Study Planner. Create a personalized study schedule.
      
Rules:
- Create a realistic, balanced schedule
- Include break times and review sessions
- Prioritize based on difficulty and importance
- Add specific daily tasks
- Include milestone checkpoints
- Format as structured markdown with clear sections`,
    },
    {
      role: "user",
      content: `Create a study plan for me:
- Subjects: ${subjects.join(", ")}
- Goals: ${goals}
- Available hours per day: ${availableHours}
- Duration: ${duration}
Please create a detailed weekly schedule.`,
    },
  ])
}
