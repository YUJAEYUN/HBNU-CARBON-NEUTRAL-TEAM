"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import axiosInstance from "@/lib/axios";
import { useVoiceStore } from "@/store/voiceStore";
import { CHARACTER_STAGES, ActivityTabType } from "./constants";
import { ChatMessage, TextMessage, ImageMessage } from "@/types/chat";
import { Certification } from "@/types/certification";
import { SAMPLE_CERTIFICATIONS } from "./data/certifications";

// 컴포넌트 임포트
import CharacterHeader from "./components/CharacterHeader";
import CharacterInfo from "./components/CharacterInfo";
import CharacterDisplay from "./components/CharacterDisplay";
import ActivityTabs from "./components/ActivityTabs";
import ChatInterface from "./components/ChatInterface";
import CertificationList from "./components/CertificationList";

// 전역 타입 확장 (window.handleVoiceMessage 함수 정의)
declare global {
  interface Window {
    handleVoiceMessage?: (text: string) => void;
  }
}

export default function CharacterPage() {
  const { isLoading: authLoading } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  const [activeTab, setActiveTab] = useState<ActivityTabType>("daily");
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 채팅 관련 상태
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      type: "text",
      content: "안녕하세요! 무엇을 도와드릴까요?"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Zustand 스토어에서 음성 인식 관련 상태와 함수 가져오기
  const {
    isListening,
    isSpeaking,
    voiceMode,
    recognizedText,
    recording,
    initialize,
    toggleVoiceRecognition,
    stopSpeakingVoice: handleStopSpeaking,
    setVoiceMode,
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
  const handleSendMessage = useCallback(async (messageText: string, imageUrl?: string) => {
    if (!messageText?.trim()) return;

    try {
      setChatLoading(true);

      // 이미지가 있는 경우 이미지 채팅 처리
      if (imageUrl) {
        // 동적 임포트로 chatWithImage 함수 가져오기
        const { chatWithImage } = await import('@/lib/openai');

        // 기존 채팅 메시지를 OpenAI 형식으로 변환
        const openaiMessages = chatMessages
          .filter(msg => msg.type === 'text') // 텍스트 메시지만 필터링
          .map(msg => ({
            role: msg.role,
            content: (msg as TextMessage).content
          }));

        // 이미지와 함께 채팅
        const response = await chatWithImage(openaiMessages, imageUrl, messageText);

        // 사용자 이미지 메시지 추가
        const userImageMessage: ImageMessage = {
          role: "user",
          type: "image",
          imageUrl: imageUrl,
          caption: messageText.replace('[이미지: ', '').replace(']', '')
        };

        const updatedMessages = [...chatMessages, userImageMessage];
        setChatMessages(updatedMessages);

        // 응답 메시지 추가
        if (response.message) {
          const assistantMessage: TextMessage = {
            role: "assistant",
            type: "text",
            content: typeof response.message.content === 'string'
              ? response.message.content
              : '이미지를 분석했습니다.'
          };
          setChatMessages([...updatedMessages, assistantMessage]);
        }
      } else {
        // 일반 텍스트 메시지 처리
        const userMessage: TextMessage = {
          role: "user",
          type: "text",
          content: messageText
        };
        const updatedMessages = [...chatMessages, userMessage];
        setChatMessages(updatedMessages);

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
  }, [chatMessages]);

  // 음성 인식 토글 핸들러
  const handleVoiceToggle = useCallback(() => {
    // 음성 인식 토글 (녹음 시작/중지)
    toggleVoiceRecognition();

    // 음성 메시지 처리 함수를 전역으로 등록
    if (typeof window !== 'undefined') {
      window.handleVoiceMessage = (text: string) => {
        if (text && text.trim()) {
          // 인식된 텍스트를 바로 메시지로 전송
          handleSendMessage(text);
        }
      };
    }

    return ''; // 텍스트가 없는 경우 빈 문자열 반환
  }, [toggleVoiceRecognition, handleSendMessage]);

  // 챗봇 창 열기 시 음성 모드 활성화
  useEffect(() => {
    if (showChatbot) {
      setVoiceMode(true);
    }
  }, [showChatbot, setVoiceMode]);

  // 챗봇 창 닫기 시 음성 인식 중지 (텍스트 전송하지 않음)
  useEffect(() => {
    // 챗봇 창이 닫힐 때만 실행
    if (!showChatbot) {
      // 음성 인식 중이면 중지
      if (isListening || recording.isRecording) {
        toggleVoiceRecognition();
      }
    }
  }, [showChatbot, isListening, recording, toggleVoiceRecognition]);

  // 현재 사용자 포인트 (인증 데이터에서 계산)
  const currentPoints = certifications.reduce((total, cert) => total + (cert.points || 0), 0);

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

  // 인증 내역 데이터 로드
  useEffect(() => {
    const loadCertifications = () => {
      setIsLoading(true);
      try {
        // 로컬 스토리지에서 실제 인증 데이터 가져오기
        const storedCertifications = localStorage.getItem('certifications');
        if (storedCertifications) {
          const parsedCertifications = JSON.parse(storedCertifications);
          console.log('[Character Page] Loaded certifications from localStorage:', parsedCertifications);
          setCertifications(parsedCertifications);
        } else {
          // 로컬 스토리지에 데이터가 없으면 샘플 데이터 사용
          console.log('[Character Page] No certifications in localStorage, using sample data');
          setCertifications(SAMPLE_CERTIFICATIONS);
        }
      } catch (err) {
        console.error('인증 목록 가져오기 오류:', err);
        // 오류 발생 시 샘플 데이터 사용
        setCertifications(SAMPLE_CERTIFICATIONS);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertifications();

    // 페이지가 포커스될 때마다 데이터 새로고침 (다른 페이지에서 인증 후 돌아왔을 때)
    const handleFocus = () => {
      loadCertifications();
    };

    // storage 이벤트 리스너 추가 (같은 탭에서 localStorage 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'certifications') {
        loadCertifications();
      }
    };

    // 커스텀 이벤트 리스너 추가 (같은 페이지에서 localStorage 변경 감지)
    const handleCertificationUpdate = () => {
      loadCertifications();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('certificationUpdated', handleCertificationUpdate);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('certificationUpdated', handleCertificationUpdate);
    };
  }, []);

  // 로딩 중일 때 로딩 화면 표시
  if (authLoading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex-1 flex flex-col h-screen pb-[80px] overflow-hidden bg-toss-gray-50">
      {/* 상단 헤더 */}
      <CharacterHeader
        onInfoClick={() => setShowInfo(!showInfo)}
        onStatsClick={() => setShowCertifications(!showCertifications)}
      />

      {/* 캐릭터 정보 팝업 */}
      {showInfo && (
        <CharacterInfo
          currentStage={currentStage}
          currentPoints={currentPoints}
          onClose={() => setShowInfo(false)}
        />
      )}

      <div className="flex-1 flex flex-col items-center px-5 py-4 overflow-y-auto">
        {/* 캐릭터 레벨 표시 카드 */}
        <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-toss-2 border border-toss-gray-200 mb-6">
          <div className="flex flex-col items-center">
            <CharacterDisplay
              currentStage={currentStage}
              currentPoints={currentPoints}
              nextStage={nextStage}
              progressPercentage={progressPercentage}
              pointsToNextLevel={pointsToNextLevel}
              onChatbotToggle={() => setShowChatbot(!showChatbot)}
            />
          </div>
        </div>

        {/* 활동량 표시 탭 */}
        <div className="w-full max-w-sm flex flex-col items-center">
          <ActivityTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
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

      {/* 인증 내역 목록 */}
      <CertificationList
        certifications={certifications}
        isVisible={showCertifications}
        onClose={() => setShowCertifications(false)}
      />
    </div>
  );
}
