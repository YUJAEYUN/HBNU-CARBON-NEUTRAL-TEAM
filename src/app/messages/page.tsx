"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaReply, FaSearch, FaTimes, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// 쪽지 타입 정의
interface Message {
  id: number;
  sender: string;
  recipient: string;
  content: string;
  postTitle?: string;
  postId?: number;
  timestamp: string;
  isRead: boolean;
}

// 채팅방 타입 정의
interface ChatRoom {
  person: string;
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  // 쪽지 데이터 로드
  useEffect(() => {
    // 로컬 스토리지에서 쪽지 데이터 불러오기
    const storedMessages = localStorage.getItem("user_messages");
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("쪽지 데이터 파싱 오류:", error);
      }
    } else {
      // 샘플 쪽지 데이터 (실제로는 API에서 가져올 것)
      const sampleMessages: Message[] = [
        {
          id: 1,
          sender: "환경지킴이",
          recipient: "나",
          content: "안녕하세요! 환경 활동에 관심이 있으신가요? 다음 주 화요일에 캠퍼스 청소 활동이 있습니다. 참여하실래요?",
          postTitle: "5월 캠퍼스 대청소 참가자 모집",
          postId: 5,
          timestamp: "2023-05-15 14:30",
          isRead: false
        },
        {
          id: 2,
          sender: "에코프렌즈",
          recipient: "나",
          content: "분리수거 인증 게시글 잘 봤습니다! 저희 동아리에 관심 있으시면 연락주세요.",
          postTitle: "오늘의 분리수거 인증",
          postId: 8,
          timestamp: "2023-05-14 09:15",
          isRead: true
        },
        {
          id: 3,
          sender: "나",
          recipient: "환경지킴이",
          content: "네, 관심 있습니다! 참여 방법을 알려주세요.",
          postTitle: "5월 캠퍼스 대청소 참가자 모집",
          postId: 5,
          timestamp: "2023-05-15 15:45",
          isRead: true
        },
        {
          id: 4,
          sender: "환경지킴이",
          recipient: "나",
          content: "좋습니다! 5월 20일 화요일 오후 2시에 중앙도서관 앞에서 모입니다. 장갑과 편한 복장으로 오세요.",
          postTitle: "5월 캠퍼스 대청소 참가자 모집",
          postId: 5,
          timestamp: "2023-05-15 16:30",
          isRead: false
        }
      ];
      
      setMessages(sampleMessages);
      localStorage.setItem("user_messages", JSON.stringify(sampleMessages));
    }
  }, []);

  // 채팅방 목록 생성
  const chatRooms = useMemo(() => {
    const roomMap = new Map<string, ChatRoom>();
    
    // 모든 메시지를 순회하며 채팅방 구성
    messages.forEach(msg => {
      const otherPerson = msg.sender === "나" ? msg.recipient : msg.sender;
      
      if (!roomMap.has(otherPerson)) {
        // 새 채팅방 생성
        roomMap.set(otherPerson, {
          person: otherPerson,
          lastMessage: msg,
          unreadCount: msg.recipient === "나" && !msg.isRead ? 1 : 0,
          messages: [msg]
        });
      } else {
        // 기존 채팅방에 메시지 추가
        const room = roomMap.get(otherPerson)!;
        
        // 시간순으로 마지막 메시지 업데이트
        if (new Date(msg.timestamp) > new Date(room.lastMessage.timestamp)) {
          room.lastMessage = msg;
        }
        
        // 읽지 않은 메시지 수 업데이트
        if (msg.recipient === "나" && !msg.isRead) {
          room.unreadCount += 1;
        }
        
        room.messages.push(msg);
      }
    });
    
    // 채팅방 배열로 변환하고 마지막 메시지 시간 기준으로 정렬
    return Array.from(roomMap.values()).sort((a, b) => 
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );
  }, [messages]);

  // 검색어에 맞는 채팅방 필터링
  const filteredChatRooms = chatRooms.filter(room => 
    room.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.postTitle && msg.postTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  // 선택된 사람과의 대화 메시지
  const selectedChat = useMemo(() => {
    if (!selectedPerson) return null;
    
    // 선택된 사람과의 모든 메시지 찾기
    const chatMessages = messages.filter(msg => 
      (msg.sender === selectedPerson && msg.recipient === "나") || 
      (msg.sender === "나" && msg.recipient === selectedPerson)
    );
    
    // 시간순 정렬
    return chatMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [selectedPerson, messages]);

  // 쪽지 읽음 처리
  const markAsRead = (personName: string) => {
    const updatedMessages = messages.map(msg => 
      msg.sender === personName && msg.recipient === "나" && !msg.isRead
        ? { ...msg, isRead: true }
        : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem("user_messages", JSON.stringify(updatedMessages));
  };

  // 채팅방 선택 처리
  const selectChatRoom = (personName: string) => {
    setSelectedPerson(personName);
    markAsRead(personName);
  };

  // 쪽지 삭제
  const deleteChat = (personName: string) => {
    if (window.confirm(`${personName}님과의 모든 대화를 삭제하시겠습니까?`)) {
      const updatedMessages = messages.filter(msg => 
        !(msg.sender === personName && msg.recipient === "나") && 
        !(msg.sender === "나" && msg.recipient === personName)
      );
      setMessages(updatedMessages);
      localStorage.setItem("user_messages", JSON.stringify(updatedMessages));
      
      // 선택된 채팅방이 삭제된 경우 선택 해제
      if (selectedPerson === personName) {
        setSelectedPerson(null);
      }
    }
  };

  // 쪽지 보내기
  const sendMessage = () => {
    if (!selectedPerson || !replyText.trim()) return;
    
    // 새 쪽지 ID 생성
    const maxId = Math.max(...messages.map(msg => msg.id), 0);
    const newId = maxId + 1;
    
    // 현재 시간 포맷팅
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // 새 쪽지 객체 생성
    const newMessage: Message = {
      id: newId,
      sender: "나",
      recipient: selectedPerson,
      content: replyText,
      timestamp: timestamp,
      isRead: true
    };
    
    // 쪽지 목록에 추가
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("user_messages", JSON.stringify(updatedMessages));
    
    // 입력창 초기화
    setReplyText("");
    
    // 성공 메시지 표시
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-primary-dark">쪽지함</h1>
      </div>
      
      {/* 검색 바 */}
      <div className="bg-white p-3 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="이름 또는 내용 검색"
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setSearchTerm("")}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      {/* 채팅방 목록과 대화 내용 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 채팅방 목록 */}
        <div className="w-full md:w-1/3 bg-white border-r overflow-y-auto">
          {filteredChatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <Image
                src="/empty_message.png"
                alt="쪽지 없음"
                width={120}
                height={120}
                className="mb-4 opacity-50"
              />
              <p className="text-gray-500 text-center">
                {searchTerm ? "검색 결과가 없습니다." : "대화 내역이 없습니다."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredChatRooms.map((room) => (
                <div
                  key={room.person}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedPerson === room.person ? "bg-primary-light" : ""
                  } ${room.unreadCount > 0 ? "bg-blue-50" : ""}`}
                  onClick={() => selectChatRoom(room.person)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">{room.person}</span>
                      {room.unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">{room.lastMessage.timestamp.split(" ")[0]}</span>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(room.person);
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 대화 내용 (모바일에서는 숨김, 데스크톱에서만 표시) */}
        <div className="hidden md:flex md:w-2/3 bg-gray-50 flex-col">
          {selectedPerson && selectedChat ? (
            <>
              {/* 채팅방 헤더 */}
              <div className="p-4 bg-white border-b">
                <h2 className="font-bold text-primary-dark">{selectedPerson}</h2>
              </div>
              
              {/* 메시지 목록 */}
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedChat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 max-w-[80%] ${
                      msg.sender === "나" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "나"
                          ? "bg-primary text-white"
                          : "bg-white shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                      {msg.postTitle && (
                        <div 
                          className={`mt-2 text-xs ${msg.sender === "나" ? "text-primary-light" : "text-gray-500"} cursor-pointer`}
                          onClick={() => router.push(`/community/post/${msg.postId}`)}
                        >
                          게시글: {msg.postTitle}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.timestamp.split(" ")[1]}
                    </div>
                  </div>
                ))}
                {messageSent && (
                  <div className="text-center text-xs text-green-500 my-2">
                    메시지가 전송되었습니다
                  </div>
                )}
              </div>
              
              {/* 메시지 입력 */}
              <div className="p-3 bg-white border-t">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="메시지를 입력하세요..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    className="bg-primary text-white p-2 rounded-r-lg"
                    onClick={sendMessage}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <Image
                src="/select_message.png"
                alt="쪽지 선택"
                width={150}
                height={150}
                className="mb-4 opacity-50"
              />
              <p className="text-gray-500">채팅방을 선택하여 대화를 시작하세요.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 모바일에서 대화 내용 (선택된 경우에만 표시) */}
      <AnimatePresence>
        {selectedPerson && selectedChat && (
          <motion.div
            className="md:hidden fixed inset-0 bg-white z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* 채팅방 헤더 */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-primary-dark">{selectedPerson}</h2>
              <button
                className="text-gray-500"
                onClick={() => setSelectedPerson(null)}
              >
                <FaTimes />
              </button>
            </div>
            
            {/* 메시지 목록 */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedChat.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 max-w-[80%] ${
                    msg.sender === "나" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === "나"
                        ? "bg-primary text-white"
                        : "bg-white shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {msg.postTitle && (
                      <div 
                        className={`mt-2 text-xs ${msg.sender === "나" ? "text-primary-light" : "text-gray-500"} cursor-pointer`}
                        onClick={() => router.push(`/community/post/${msg.postId}`)}
                      >
                        게시글: {msg.postTitle}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.split(" ")[1]}
                  </div>
                </div>
              ))}
              {messageSent && (
                <div className="text-center text-xs text-green-500 my-2">
                  메시지가 전송되었습니다
                </div>
              )}
            </div>
            
            {/* 메시지 입력 */}
            <div className="p-3 bg-white border-t">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="메시지를 입력하세요..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="bg-primary text-white p-2 rounded-r-lg"
                  onClick={sendMessage}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
