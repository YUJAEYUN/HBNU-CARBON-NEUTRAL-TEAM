"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import axiosInstance from "@/lib/axios";
import { useVoiceStore } from "@/store/voiceStore";
import { CHARACTER_STAGES, ActivityTabType } from "./constants";
import { ChatMessage, TextMessage } from "@/types/chat";

// 컴포넌트 임포트
import CharacterHeader from "./components/CharacterHeader";
import CharacterInfo from "./components/CharacterInfo";
import CharacterDisplay from "./components/CharacterDisplay";
import ActivityTabs from "./components/ActivityTabs";
import ChatInterface from "./components/ChatInterface";


export default function CharacterPage() {
  const { isLoading } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeTab, setActiveTab] = useState<ActivityTabType>("daily");
  // 채팅 관련 상태
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      type: "text",
      content: "안녕하세요! 저는 탄소중립을 도와주는 대나무예요 🌱 오늘은 어떤 친환경 활동을 하셨나요? 작은 실천도 정말 소중해요!"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Zustand 스토어에서 음성 인식 관련 상태와 함수 가져오기
  const {
    isListening,
    isSpeaking,
    voiceMode,
    recognizedText,
    initialize,
    startVoiceRecognition,
    stopVoiceRecognition,
    stopSpeakingVoice: handleStopSpeaking,
    setVoiceMode,
    setRecognizedText,
    speakMessage
  } = useVoiceStore();

  // 음성 인식 초기화 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 새 메시지가 추가될 때 TTS로 읽기
  useEffect(() => {
    // 마지막 메시지가 어시스턴트의 텍스트 메시지이고, 음성 모드가 활성화되어 있을 때만 TTS 실행
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.type === 'text' && voiceMode) {
      speakMessage(lastMessage.content);
    }
  }, [chatMessages, voiceMode, speakMessage]);



  // 챗봇 메시지 전송 처리
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText?.trim()) return;

    try {
      // 사용자 메시지 추가
      const userMessage: TextMessage = {
        role: "user",
        type: "text",
        content: messageText
      };
      const updatedMessages = [...chatMessages, userMessage];
      setChatMessages(updatedMessages);
      setChatLoading(true);

      // axiosInstance를 사용한 API 호출
      const response = await axiosInstance.post("/api/chat", {
        messages: updatedMessages
      });

      // 응답 메시지 추가
      if (response.data.message) {
        // API 응답에 type 필드가 없을 경우 추가
        const assistantMessage = response.data.message.type
          ? response.data.message
          : { ...response.data.message, type: "text" };

        setChatMessages([...updatedMessages, assistantMessage]);
      }
    } catch (error) {
      console.error("채팅 오류:", error);
      // 오류 메시지 추가
      setChatMessages([
        ...chatMessages,
        {
          role: "assistant",
          type: "text",
          content: "죄송합니다. 대화 처리 중 오류가 발생했습니다."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatMessages, setChatMessages, setChatLoading]);

  // 음성 인식 토글 핸들러
  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      // 음성 인식 중지 및 텍스트 전송
      const text = stopVoiceRecognition();
      if (text && text.trim()) {
        // [en] 태그 제거하고 음성입력 태그 추가
        const cleanText = text.replace('[en] ', '');

        // 영어로 인식된 경우 표시 (짧은 접두사 사용)
        const isEnglish = text.includes('[en]');
        // 토큰 수를 줄이기 위해 접두사를 최소화
        const messagePrefix = isEnglish ? '🇺🇸 ' : '🎤 ';

        // 메시지 전송 (토큰 수를 줄이기 위해 접두사 최소화)
        handleSendMessage(`${messagePrefix}${cleanText}`);
      }
    } else {
      // 음성 인식 시작 전 상태 표시
      setChatLoading(true);

      // 인식된 텍스트 초기화
      setRecognizedText('');

      // 음성 인식 시작 (약간의 지연으로 UI 업데이트 시간 확보)
      setTimeout(() => {
        startVoiceRecognition();
        setChatLoading(false);
      }, 100);
    }
  }, [isListening, startVoiceRecognition, stopVoiceRecognition, handleSendMessage, setChatLoading, setRecognizedText]);

  // 챗봇 창 열기 시 음성 모드 활성화
  useEffect(() => {
    if (showChatbot) {
      setVoiceMode(true);
    }
  }, [showChatbot, setVoiceMode]);

  // 챗봇 창 닫기 시 음성 인식 중지
  useEffect(() => {
    // 챗봇 창이 닫힐 때만 실행
    if (!showChatbot && isListening) {
      const text = stopVoiceRecognition();
      if (text && text.trim()) {
        // [en] 태그 제거하고 음성입력 태그 추가
        const cleanText = text.replace('[en] ', '');

        // 영어로 인식된 경우 표시 (짧은 접두사 사용)
        const isEnglish = text.includes('[en]');
        // 토큰 수를 줄이기 위해 접두사를 최소화
        const messagePrefix = isEnglish ? '🇺🇸 ' : '🎤 ';

        // 메시지 전송 (토큰 수를 줄이기 위해 접두사 최소화)
        handleSendMessage(`${messagePrefix}${cleanText}`);
      }
    }
  }, [showChatbot, isListening, stopVoiceRecognition, handleSendMessage]);

  // 현재 사용자 포인트 (실제로는 API에서 가져올 값)
  const currentPoints = 180;

  // 현재 캐릭터 단계 계산
  const currentStage = CHARACTER_STAGES.reduce((prev, curr) => {
    return currentPoints >= curr.requiredPoints ? curr : prev;
  }, CHARACTER_STAGES[0]);

  // 다음 단계 계산
  const nextStageIndex = CHARACTER_STAGES.findIndex(stage => stage.level === currentStage.level) + 1;
  const nextStage = nextStageIndex < CHARACTER_STAGES.length ? CHARACTER_STAGES[nextStageIndex] : null;

  // 다음 단계까지 남은 포인트
  const pointsToNextLevel = nextStage ? nextStage.requiredPoints - currentPoints : 0;

  // 진행률 계산
  const progressPercentage = nextStage
    ? ((currentPoints - currentStage.requiredPoints) / (nextStage.requiredPoints - currentStage.requiredPoints)) * 100
    : 100;

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex-1 flex flex-col h-full pb-[76px]">
      {/* 상단 헤더 */}
      <CharacterHeader
        onInfoClick={() => setShowInfo(!showInfo)}
        onStatsClick={() => alert("활동 실적 기능은 준비 중입니다.")}
      />

      {/* 캐릭터 정보 팝업 */}
      {showInfo && (
        <CharacterInfo
          currentStage={currentStage}
          currentPoints={currentPoints}
          onClose={() => setShowInfo(false)}
        />
      )}

      <div className="flex-1 flex flex-col items-center p-4">
        {/* 캐릭터 레벨 표시 */}
        <CharacterDisplay
          currentStage={currentStage}
          currentPoints={currentPoints}
          nextStage={nextStage}
          progressPercentage={progressPercentage}
          pointsToNextLevel={pointsToNextLevel}
          onChatbotToggle={() => setShowChatbot(!showChatbot)}
        />

        {/* 활동량 표시 탭 */}
        <ActivityTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* 챗봇 대화창 */}
      {showChatbot && (
        <ChatInterface
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chatLoading={chatLoading}
          setChatLoading={setChatLoading}
          isListening={isListening}
          isSpeaking={isSpeaking}
          recognizedText={recognizedText}
          handleVoiceToggle={handleVoiceToggle}
          handleStopSpeaking={handleStopSpeaking}
          speakMessage={speakMessage}
          handleSendMessage={handleSendMessage}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
}
