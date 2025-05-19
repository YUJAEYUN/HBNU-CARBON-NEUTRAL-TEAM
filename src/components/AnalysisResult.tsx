"use client";

import { useState } from 'react';
import { getImageUrl } from '@/utils/api';

interface Material {
  name: string;
  confidence: number;
  korean_name?: string;
}

interface CompositeMaterial {
  materials: string[];
  composite_key: string;
  rule: {
    description: string;
    examples: string[];
    separation_method: string;
    steps: string[];
  };
}

interface Recommendation {
  recyclable_materials: Material[];
  non_recyclable_materials: Material[];
  composite_materials: CompositeMaterial[];
  general_instructions: string;
  detailed_steps: string[];
}

interface CarbonImpact {
  total_carbon_impact: number;
  total_carbon_saving: number;
  carbon_details: Array<{
    material: string;
    korean_name: string;
    base_impact: number;
    weighted_impact: number;
    carbon_saving: number;
    confidence: number;
  }>;
  impact_level: string;
  impact_description: string;
  saving_level: string;
  saving_description: string;
}

interface AnalysisResult {
  image_id: string;
  filename: string;
  content_type: string;
  user_id?: string;
  category?: string;
  date: string;
  time: string;
  recycling_analysis: {
    detected_materials: Record<string, Material>;
    composite_materials: CompositeMaterial[];
    recommendations: Recommendation;
    carbon_impact: CarbonImpact;
  };
  detected_labels: Array<{ description: string; score: number }>;
  detected_objects: Array<{ name: string; score: number }>;
}

interface AnalysisResultProps {
  result: AnalysisResult;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!result) {
    return <div>분석 결과가 없습니다.</div>;
  }

  const { recycling_analysis, image_id, date, time } = result;
  const { detected_materials, recommendations, carbon_impact } = recycling_analysis;

  // 이미지 URL 생성
  const imageUrl = getImageUrl(image_id);

  // 재활용 가능 여부 판단
  const isRecyclable = recommendations.recyclable_materials.length > 0;
  const recyclabilityStatus = isRecyclable
    ? recommendations.non_recyclable_materials.length > 0
      ? '부분 재활용 가능'
      : '재활용 가능'
    : '재활용 불가';

  // 재활용 상태에 따른 색상 클래스
  const statusColorClass = isRecyclable
    ? recommendations.non_recyclable_materials.length > 0
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <div className="analysis-result bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">분석 결과</h2>

        <div className="image-and-summary flex flex-col md:flex-row gap-4 mb-6">
          {/* 이미지 섹션 */}
          <div className="image-section w-full md:w-1/3">
            <img
              src={imageUrl}
              alt="Analyzed"
              className="w-full h-auto rounded-lg"
            />
            <div className="text-sm text-gray-500 mt-2">
              촬영 일시: {date} {time}
            </div>
          </div>

          {/* 요약 섹션 */}
          <div className="summary-section w-full md:w-2/3">
            <div className={`recyclability-status ${statusColorClass} px-4 py-2 rounded-lg mb-4 inline-block`}>
              {recyclabilityStatus}
            </div>

            <div className="materials-summary">
              <h3 className="font-semibold mb-2">감지된 재질</h3>
              <ul className="list-disc pl-5 mb-4">
                {Object.entries(detected_materials).map(([key, material]) => (
                  <li key={key}>
                    {material.korean_name || key}: {(material.confidence * 100).toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>

            <div className="general-instructions">
              <h3 className="font-semibold mb-2">일반 지침</h3>
              <p className="mb-4">{recommendations.general_instructions}</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tabs-navigation border-b mb-4">
          <div className="flex">
            <button
              className={`py-2 px-4 ${activeTab === 'summary' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('summary')}
            >
              요약
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              상세 정보
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'steps' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('steps')}
            >
              분리배출 방법
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'carbon' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('carbon')}
            >
              탄소 영향
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="tab-content">
          {/* 요약 탭 */}
          {activeTab === 'summary' && (
            <div className="summary-tab">
              <div className="recyclable-materials mb-4">
                <h3 className="font-semibold mb-2">재활용 가능 재질</h3>
                {recommendations.recyclable_materials.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {recommendations.recyclable_materials.map((material, index) => (
                      <li key={index}>
                        {material.korean_name || material.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">재활용 가능한 재질이 감지되지 않았습니다.</p>
                )}
              </div>

              <div className="non-recyclable-materials">
                <h3 className="font-semibold mb-2">재활용 불가 재질</h3>
                {recommendations.non_recyclable_materials.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {recommendations.non_recyclable_materials.map((material, index) => (
                      <li key={index}>
                        {material.korean_name || material.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">재활용 불가능한 재질이 감지되지 않았습니다.</p>
                )}
              </div>
            </div>
          )}

          {/* 상세 정보 탭 */}
          {activeTab === 'details' && (
            <div className="details-tab">
              <div className="composite-materials mb-4">
                <h3 className="font-semibold mb-2">복합 재질</h3>
                {recycling_analysis.composite_materials.length > 0 ? (
                  <div>
                    {recycling_analysis.composite_materials.map((composite, index) => (
                      <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">{composite.rule.description}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          예시: {composite.rule.examples.join(', ')}
                        </p>
                        <p className="mt-2">{composite.rule.separation_method}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">복합 재질이 감지되지 않았습니다.</p>
                )}
              </div>

              <div className="detected-objects">
                <h3 className="font-semibold mb-2">감지된 객체</h3>
                <div className="grid grid-cols-2 gap-2">
                  {result.detected_objects.map((obj, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      {obj.name}: {(obj.score * 100).toFixed(1)}%
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 분리배출 방법 탭 */}
          {activeTab === 'steps' && (
            <div className="steps-tab">
              <h3 className="font-semibold mb-2">분리배출 단계</h3>
              {recommendations.detailed_steps.length > 0 ? (
                <ol className="list-decimal pl-5">
                  {recommendations.detailed_steps.map((step, index) => (
                    <li key={index} className="mb-2">{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">상세 분리배출 단계가 제공되지 않았습니다.</p>
              )}

              {recycling_analysis.composite_materials.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">복합 재질 분리 방법</h3>
                  {recycling_analysis.composite_materials.map((composite, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-medium">{composite.rule.description}</h4>
                      <ol className="list-decimal pl-5 mt-2">
                        {composite.rule.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="mb-1">{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 탄소 영향 탭 */}
          {activeTab === 'carbon' && (
            <div className="carbon-tab">
              <div className="carbon-impact-summary mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 탄소 발자국 */}
                  <div className="carbon-footprint p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">탄소 발자국</h3>
                    <div className="flex items-center mb-2">
                      <div className={`text-lg font-bold px-3 py-1 rounded-lg mr-2
                        ${carbon_impact.impact_level === '매우 낮음' ? 'bg-green-100 text-green-800' :
                          carbon_impact.impact_level === '낮음' ? 'bg-green-200 text-green-800' :
                          carbon_impact.impact_level === '중간' ? 'bg-yellow-100 text-yellow-800' :
                          carbon_impact.impact_level === '높음' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}>
                        {carbon_impact.impact_level}
                      </div>
                      <span className="text-gray-600">
                        {carbon_impact.total_carbon_impact.toFixed(2)} kg CO₂
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{carbon_impact.impact_description}</p>
                  </div>

                  {/* 탄소 절감 효과 */}
                  <div className="carbon-saving p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">재활용 시 탄소 절감 효과</h3>
                    <div className="flex items-center mb-2">
                      <div className={`text-lg font-bold px-3 py-1 rounded-lg mr-2
                        ${carbon_impact.saving_level === '매우 높음' ? 'bg-green-100 text-green-800' :
                          carbon_impact.saving_level === '높음' ? 'bg-green-200 text-green-800' :
                          carbon_impact.saving_level === '중간' ? 'bg-yellow-100 text-yellow-800' :
                          carbon_impact.saving_level === '낮음' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}>
                        {carbon_impact.saving_level}
                      </div>
                      <span className="text-gray-600">
                        {carbon_impact.total_carbon_saving.toFixed(2)} kg CO₂ 절감
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{carbon_impact.saving_description}</p>
                  </div>
                </div>
              </div>

              {/* 재질별 탄소 영향 */}
              <div className="carbon-details">
                <h3 className="font-semibold mb-3">재질별 탄소 영향</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-left">재질</th>
                        <th className="py-2 px-4 border-b text-right">탄소 발자국 (kg CO₂)</th>
                        <th className="py-2 px-4 border-b text-right">재활용 시 절감량 (kg CO₂)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carbon_impact.carbon_details.map((detail, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2 px-4 border-b">{detail.korean_name}</td>
                          <td className="py-2 px-4 border-b text-right">{detail.weighted_impact.toFixed(2)}</td>
                          <td className="py-2 px-4 border-b text-right">{detail.carbon_saving.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-semibold">
                        <td className="py-2 px-4 border-b">총계</td>
                        <td className="py-2 px-4 border-b text-right">{carbon_impact.total_carbon_impact.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b text-right">{carbon_impact.total_carbon_saving.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* 탄소중립 팁 */}
              <div className="carbon-neutral-tips mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">탄소중립 실천 팁</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>재활용품은 깨끗하게 분리하여 배출하세요.</li>
                  <li>일회용품 사용을 줄이고 다회용품을 사용하세요.</li>
                  <li>불필요한 포장재를 줄이는 제품을 선택하세요.</li>
                  <li>가능한 경우 재활용 또는 재사용 가능한 제품을 구매하세요.</li>
                  <li>음식물 쓰레기를 줄이고 퇴비화하세요.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
