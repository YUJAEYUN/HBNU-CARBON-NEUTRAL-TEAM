// 메시지 타입 정의
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'image';

// 기본 메시지 인터페이스
export interface BaseMessage {
  role: MessageRole;
  type: MessageType;
}

// 텍스트 메시지
export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

// 이미지 메시지
export interface ImageMessage extends BaseMessage {
  type: 'image';
  imageUrl: string;
  caption?: string; // 선택적 이미지 설명
}

// 통합 메시지 타입
export type ChatMessage = TextMessage | ImageMessage;

// 채팅 응답 타입 정의
export interface ChatResponse {
  message: TextMessage;
  error?: string;
}
