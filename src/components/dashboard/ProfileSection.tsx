"use client";
import React, { useState } from 'react';
import { FaUser, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';

interface ProfileSectionProps {
  user: any;
  handleLogout: () => Promise<void>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, handleLogout }) => {
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [appLock, setAppLock] = useState(false);

  // 섹션 토글 함수들
  const toggleAccountSettings = () => setShowAccountSettings(!showAccountSettings);
  const toggleCustomerSupport = () => setShowCustomerSupport(!showCustomerSupport);
  const toggleInviteFriends = () => setShowInviteFriends(!showInviteFriends);
  const toggleAppSettings = () => setShowAppSettings(!showAppSettings);

  return (
    <div className="px-5 py-4 pb-16">
      {/* 프로필 카드 - 토스 스타일 */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-toss-2 border border-toss-gray-200">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-toss-green/10 rounded-full flex items-center justify-center mr-4">
            <FaUser className="text-toss-green text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-toss-gray-900">{user?.nickname || "김대학"}</h3>
            <p className="text-sm text-toss-gray-600 mb-3">{user?.school || "환경대학교"} • {user?.grade || "1학년"}</p>
            <button
              className="px-4 py-2 bg-toss-green/10 text-toss-green rounded-xl text-sm font-medium flex items-center hover:bg-toss-green/20 transition-colors"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2 text-sm" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* 계정 관리 - 토스 스타일 */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-toss-2 border border-toss-gray-200">
        <button
          className="w-full flex justify-between items-center"
          onClick={toggleAccountSettings}
        >
          <h3 className="text-toss-gray-900 font-bold text-lg">계정 관리</h3>
          <FaChevronRight className={`text-toss-gray-400 transition-transform duration-300 ${showAccountSettings ? 'transform rotate-90' : ''}`} />
        </button>

        {showAccountSettings && (
          <div className="mt-5 space-y-4">
            <div className="border-b border-toss-gray-200 pb-4">
              <p className="text-sm text-toss-gray-600 mb-2 font-medium">별명</p>
              <div className="flex justify-between items-center">
                <p className="text-toss-gray-900">{user?.nickname || "김대학"}</p>
                <button className="text-xs text-toss-green px-3 py-1 border border-toss-green rounded-full font-medium hover:bg-toss-green/10 transition-colors">
                  변경
                </button>
              </div>
            </div>

            <div className="border-b border-toss-gray-200 pb-4">
              <p className="text-sm text-toss-gray-600 mb-2 font-medium">캐릭터 별명</p>
              <div className="flex justify-between items-center">
                <p className="text-toss-gray-900">나무지기</p>
                <button className="text-xs text-toss-green px-3 py-1 border border-toss-green rounded-full font-medium hover:bg-toss-green/10 transition-colors">
                  변경
                </button>
              </div>
            </div>

            <div className="border-b border-toss-gray-200 pb-4">
              <p className="text-sm text-toss-gray-600 mb-2 font-medium">아이디(이메일)</p>
              <div className="flex justify-between items-center">
                <p className="text-toss-gray-900">Cnergy@hbnu.ac.kr</p>
                <button className="text-xs text-toss-green px-3 py-1 border border-toss-green rounded-full font-medium hover:bg-toss-green/10 transition-colors">
                  변경
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-toss-gray-600 mb-2 font-medium">비밀번호</p>
              <div className="flex justify-between items-center">
                <p className="text-toss-gray-900">••••••••</p>
                <button className="text-xs text-toss-green px-3 py-1 border border-toss-green rounded-full font-medium hover:bg-toss-green/10 transition-colors">
                  변경
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 고객 지원 - 토스 스타일 */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-toss-2 border border-toss-gray-200">
        <button
          className="w-full flex justify-between items-center"
          onClick={toggleCustomerSupport}
        >
          <h3 className="text-toss-gray-900 font-bold text-lg">고객 지원</h3>
          <FaChevronRight className={`text-toss-gray-400 transition-transform duration-300 ${showCustomerSupport ? 'transform rotate-90' : ''}`} />
        </button>

        {showCustomerSupport && (
          <div className="mt-5 space-y-4">
            <div className="border-b border-toss-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-toss-gray-900 font-medium">앱 버전</p>
                  <p className="text-xs text-toss-gray-500">현재 버전 1.0.0</p>
                </div>
              </div>
            </div>

            <div className="border-b border-toss-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-toss-gray-900 font-medium">문의하기</p>
                  <p className="text-xs text-toss-gray-500">도움이 필요하신가요?</p>
                </div>
                <FaChevronRight className="text-toss-gray-400" />
              </div>
            </div>

            <div className="border-b border-toss-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-toss-gray-900 font-medium">공지사항</p>
                  <p className="text-xs text-toss-gray-500">최신 소식을 확인하세요</p>
                </div>
                <FaChevronRight className="text-toss-gray-400" />
              </div>
            </div>

            <div className="border-b border-toss-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-toss-gray-900 font-medium">서비스 이용약관</p>
                  <p className="text-xs text-toss-gray-500">서비스 이용에 관한 약관</p>
                </div>
                <FaChevronRight className="text-toss-gray-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-toss-gray-900 font-medium">개인정보 처리방침</p>
                  <p className="text-xs text-toss-gray-500">개인정보 수집 및 이용에 관한 정책</p>
                </div>
                <FaChevronRight className="text-toss-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 앱 설정 - 토스 스타일 */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-toss-2 border border-toss-gray-200">
        <button
          className="w-full flex justify-between items-center"
          onClick={toggleAppSettings}
        >
          <h3 className="text-toss-gray-900 font-bold text-lg">앱 설정</h3>
          <FaChevronRight className={`text-toss-gray-400 transition-transform duration-300 ${showAppSettings ? 'transform rotate-90' : ''}`} />
        </button>

        {showAppSettings && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between bg-toss-gray-50 p-3 rounded-xl">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="mr-3 h-4 w-4 rounded border-toss-gray-300 text-toss-green focus:ring-toss-green"
                />
                <label className="text-toss-gray-900 font-medium">알림 설정</label>
              </div>
            </div>
            <div className="flex items-center justify-between bg-toss-gray-50 p-3 rounded-xl">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={appLock}
                  onChange={() => setAppLock(!appLock)}
                  className="mr-3 h-4 w-4 rounded border-toss-gray-300 text-toss-green focus:ring-toss-green"
                />
                <label className="text-toss-gray-900 font-medium">암호 잠금</label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 친구 초대하기 - 토스 스타일 */}
      <div className="bg-white rounded-2xl shadow-toss-2 border border-toss-gray-200">
        <button
          className="w-full p-5 flex justify-between items-center"
          onClick={toggleInviteFriends}
        >
          <h3 className="text-toss-gray-900 font-bold text-lg">친구 초대하기</h3>
          <FaChevronRight className={`text-toss-gray-400 transition-transform duration-300 ${showInviteFriends ? 'transform rotate-90' : ''}`} />
        </button>

        {showInviteFriends && (
          <div className="px-5 pb-5 pt-2 border-t border-toss-gray-200">
            <button className="w-full mt-3 py-3 flex justify-between items-center hover:bg-toss-gray-50 rounded-xl px-4 transition-colors">
              <span className="text-toss-gray-700 font-medium">아이디 추가하기</span>
              <FaChevronRight className="text-toss-gray-400 text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
