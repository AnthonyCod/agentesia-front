export interface TestMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface BotTestRequest {
  message: string
}

export interface BotTestResponse {
  reply: string
  order_codigo?: string
}
