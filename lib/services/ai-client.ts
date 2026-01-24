// AI Client Service - OpenAI Integration for Course Generation
// Provides structured content generation using GPT-4

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIGenerationOptions {
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AIResponse<T = string> {
  content: T
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

class AIClient {
  private apiKey: string | undefined
  private baseUrl = 'https://api.openai.com/v1'
  private defaultModel = 'gpt-4o-mini'

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY
  }

  /**
   * Check if AI is configured and available
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Generate text completion
   */
  async generateText(
    messages: AIMessage[],
    options: AIGenerationOptions = {}
  ): Promise<AIResponse<string>> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.')
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4096,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()

    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    }
  }

  /**
   * Generate structured JSON output
   */
  async generateJSON<T>(
    messages: AIMessage[],
    options: AIGenerationOptions = {}
  ): Promise<AIResponse<T>> {
    // Add JSON instruction to the system message
    const jsonMessages: AIMessage[] = messages.map((msg, idx) => {
      if (idx === 0 && msg.role === 'system') {
        return {
          ...msg,
          content: `${msg.content}\n\nIMPORTANT: You must respond with valid JSON only. No markdown, no explanations, just the JSON object.`,
        }
      }
      return msg
    })

    const response = await this.generateText(jsonMessages, {
      ...options,
      temperature: options.temperature ?? 0.5, // Lower temperature for structured output
    })

    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = response.content.trim()
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7)
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3)
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3)
      }
      cleanContent = cleanContent.trim()

      const parsed = JSON.parse(cleanContent) as T
      return {
        content: parsed,
        usage: response.usage,
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', response.content)
      throw new Error('AI returned invalid JSON response')
    }
  }

  /**
   * Generate with retry on failure
   */
  async generateWithRetry<T>(
    generator: () => Promise<AIResponse<T>>,
    maxRetries = 3
  ): Promise<AIResponse<T>> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await generator()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.warn(`AI generation attempt ${attempt + 1} failed:`, lastError.message)

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
        }
      }
    }

    throw lastError || new Error('AI generation failed after retries')
  }
}

export const aiClient = new AIClient()
export { AIClient }
