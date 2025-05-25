'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('게시글 상세 페이지 오류:', error)
  }, [error])

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 상단 헤더 */}
      <div className="w-full bg-primary py-4 px-4 flex items-center shadow-md">
        <button
          onClick={() => router.push('/community')}
          className="mr-4 text-white"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-xl font-bold text-white">오류 발생</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">문제가 발생했습니다</h2>
          <p className="text-gray-700 mb-6">
            게시글을 불러오는 중 오류가 발생했습니다. 다시 시도하거나 커뮤니티 메인으로 돌아가세요.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => reset()}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              다시 시도하기
            </button>
            <button
              onClick={() => router.push('/community')}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              커뮤니티로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}