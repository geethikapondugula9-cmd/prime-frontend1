export interface ChatMessagePayload {
  id: string;
  senderId: string;
  senderName: string;
  originalMessage: string;
  translatedMessage: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}
