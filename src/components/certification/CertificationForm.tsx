"use client";

import React, { useState } from 'react';
import { FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { CertificationType, CERTIFICATION_TYPE_INFO } from '@/types/certification';

interface CertificationFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    type: CertificationType;
    location: string;
  }) => void;
  onCancel: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CertificationType>('other');
  const [location, setLocation] = useState('');
  const [showTypeList, setShowTypeList] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 선택된 인증 유형 정보
  const selectedTypeInfo = CERTIFICATION_TYPE_INFO[type];

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = '인증 제목을 입력해주세요';
    }
    
    if (!location.trim()) {
      newErrors.location = '위치를 입력해주세요';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 폼 데이터 제출
    onSubmit({
      title,
      description,
      type,
      location
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 인증 제목 입력 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          인증 제목
        </label>
        <input
          type="text"
          id="title"
          className={`ios-input w-full ${errors.title ? 'border-red-500' : ''}`}
          placeholder="인증 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* 인증 내역 입력 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          인증 내역
        </label>
        <textarea
          id="description"
          className="ios-input w-full h-24"
          placeholder="인증 내역을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* 인증 유형 선택 */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          인증 카테고리
        </label>
        <div className="relative">
          <button
            type="button"
            className="ios-input w-full flex items-center justify-between"
            onClick={() => setShowTypeList(!showTypeList)}
          >
            <div className="flex items-center">
              <span className="mr-2">{selectedTypeInfo.icon}</span>
              <span>{selectedTypeInfo.label}</span>
            </div>
            <FaChevronDown className="text-gray-400" />
          </button>
          
          <AnimatePresence>
            {showTypeList && (
              <motion.div
                className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg py-1 border border-gray-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {Object.values(CERTIFICATION_TYPE_INFO).map((typeInfo) => (
                  <button
                    key={typeInfo.id}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      setType(typeInfo.id);
                      setShowTypeList(false);
                    }}
                  >
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: typeInfo.color }}
                    >
                      {typeInfo.icon}
                    </span>
                    <div>
                      <div className="font-medium">{typeInfo.label}</div>
                      <div className="text-xs text-gray-500">{typeInfo.description}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 위치 입력 */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          위치
        </label>
        <div className="relative">
          <input
            type="text"
            id="location"
            className={`ios-input w-full pl-10 ${errors.location ? 'border-red-500' : ''}`}
            placeholder="위치를 입력하세요"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      {/* 탄소 절감량 및 포인트 정보 */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-sm font-medium text-gray-700 mb-2">예상 탄소 절감량 및 포인트</h3>
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-gray-500">탄소 절감량</p>
            <p className="font-medium text-green-600">{selectedTypeInfo.carbonReduction}kg</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">획득 포인트</p>
            <p className="font-medium text-primary">{selectedTypeInfo.points}P</p>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
        >
          인증 등록
        </button>
      </div>
    </form>
  );
};

export default CertificationForm;
