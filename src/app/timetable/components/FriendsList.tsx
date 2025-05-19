'use client';

import { FaUserFriends } from 'react-icons/fa';
import { Friend } from '../types';

interface FriendsListProps {
  friends: Friend[];
  showFriends: boolean;
  setShowFriends: (show: boolean) => void;
}

const FriendsList = ({ friends, showFriends, setShowFriends }: FriendsListProps) => {
  return (
    <div className="border-t border-gray-200">
      <button 
        className="w-full p-4 flex justify-between items-center"
        onClick={() => setShowFriends(!showFriends)}
      >
        <div className="flex items-center">
          <FaUserFriends className="mr-2 text-primary" />
          <h2 className="text-lg font-bold text-gray-800">친구 시간표</h2>
        </div>
        <div className="text-gray-500">
          {showFriends ? '▲' : '▼'}
        </div>
      </button>

      {/* 친구 목록 - 접을 수 있음 */}
      {showFriends && (
        <div className="px-4 pb-4">
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 min-w-[150px] flex-shrink-0">
                  <h3 className="font-medium text-gray-800 truncate">{friend.nickname}</h3>
                  <p className="text-xs text-gray-500 mb-2">{friend.school}</p>
                  {friend.timetable ? (
                    <button
                      className="w-full px-3 py-1 bg-primary-light text-primary text-xs rounded-full"
                      onClick={() => {
                        // 친구 시간표 보기 기능 구현
                        console.log("친구 시간표 보기:", friend.timetable);
                      }}
                    >
                      시간표 보기
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 block text-center">시간표 없음</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 w-full">
                <p>친구 목록이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
