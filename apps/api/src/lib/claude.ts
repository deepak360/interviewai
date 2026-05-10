import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const ai = {
  async complete(systemPrompt: string, userPrompt: string, maxTokens = 4096) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
    return response.choices[0].message.content || ''
  }
}
