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
    <div className="p-4 pb-16">
      {/* 프로필 카드 - iOS 스타일 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mr-4">
            <FaUser className="text-primary-dark text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user?.nickname || "김대학"}</h3>
            <p className="text-sm text-gray-600">{user?.school || "환경대학교"} • {user?.grade || "1학년"}</p>
            <button
              className="mt-2 px-4 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 shadow-sm"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-1 text-xs" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* 계정 관리 - iOS 스타일 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <button
          className="w-full flex justify-between items-center"
          onClick={toggleAccountSettings}
        >
          <h3 className="text-primary-dark font-bold">계정 관리</h3>
          <FaChevronRight className={`text-primary transition-transform duration-300 ${showAccountSettings ? 'transform rotate-90' : ''}`} />
        </button>

        {showAccountSettings && (
          <div className="mt-4 space-y-3">
            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-1">별명</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">{user?.nickname || "김대학"}</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>

            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-1">캐릭터 별명</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">나무지기</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>

            <div className="border-b pb-3">
              <p className="text-sm text-gray-600 mb-1">아이디(이메일)</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">Cnergy@hbnu.ac.kr</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">비밀번호</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">••••••••</p>
                <button className="text-xs text-primary px-2 py-1 border border-primary rounded-full">
                  변경
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 고객 지원 - iOS 스타일 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <button
          className="w-full flex justify-between items-center"
          onClick={toggleCustomerSupport}
        >
          <h3 className="text-primary-dark font-bold">고객 지원</h3>
          <FaChevronRight className={`text-primary transition-transform duration-300 ${showCustomerSupport ? 'transform rotate-90' : ''}`} />
        </button>

        {showCustomerSupport && (
          <div className="mt-4 space-y-3">
            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">앱 버전</p>
                  <p className="text-xs text-gray-500">현재 버전 1.0.0</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">문의하기</p>
                  <p className="text-xs text-gray-500">도움이 필요하신가요?</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>

            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">공지사항</p>
                  <p className="text-xs text-gray-500">최신 소식을 확인하세요</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>

            <div className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">서비스 이용약관</p>
                  <p className="text-xs text-gray-500">서비스 이용에 관한 약관</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">개인정보 처리방침</p>
                  <p className="text-xs text-gray-500">개인정보 수집 및 이용에 관한 정책</p>
                </div>
                <FaChevronRight className="text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 앱 설정 - iOS 스타일 */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <button
          className="w-full flex justify-between items-center"
          onClick={toggleAppSettings}
        >
          <h3 className="text-primary-dark font-bold">앱 설정</h3>
          <FaChevronRight className={`text-primary transition-transform duration-300 ${showAppSettings ? 'transform rotate-90' : ''}`} />
        </button>

        {showAppSettings && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="text-gray-800">알림 설정</label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={appLock}
                  onChange={() => setAppLock(!appLock)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="text-gray-800">암호 잠금</label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 친구 초대하기 - iOS 스타일 */}
      <div className="space-y-2">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <button
            className="w-full p-4 flex justify-between items-center"
            onClick={toggleInviteFriends}
          >
            <h3 className="text-primary-dark font-bold">친구 초대하기</h3>
            <FaChevronRight className={`text-primary transition-transform duration-300 ${showInviteFriends ? 'transform rotate-90' : ''}`} />
          </button>

          {showInviteFriends && (
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              <button className="w-full mt-2 py-3 flex justify-between items-center hover:bg-primary-light rounded-lg px-3">
                <span className="text-gray-700">아이디 추가하기</span>
                <FaChevronRight className="text-gray-400 text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
