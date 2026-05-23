export type Canal = 'instagram' | 'facebook' | 'whatsapp'
export type ConversationEstado = 'activa' | 'archivada'
export type MessageRole = 'user' | 'assistant'

export interface Conversation {
  id: string
  tenant_id: string
  user_channel_id: string
  canal: Canal
  estado: ConversationEstado
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  tenant_id: string
  role: MessageRole
  content: string
  created_at: string
}

export interface ConversationWithMessages {
  conversation: Conversation
  messages: Message[]
}
