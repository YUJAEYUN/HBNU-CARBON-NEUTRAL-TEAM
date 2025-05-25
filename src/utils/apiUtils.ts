// API 호출을 위한 유틸리티 함수

// 시간표 관련 API
export const timetableApi = {
  // 시간표 목록 조회
  getTimetables: async () => {
    try {
      const response = await fetch('/api/timetable');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '시간표 목록을 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('시간표 목록 조회 오류:', error);
      throw error;
    }
  },
  
  // 특정 시간표 조회
  getTimetable: async (id: number) => {
    try {
      const response = await fetch(`/api/timetable?id=${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '시간표를 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('시간표 조회 오류:', error);
      throw error;
    }
  },
  
  // 시간표 생성
  createTimetable: async (timetable: { name: string; semester: string }) => {
    try {
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetable)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '시간표 생성 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('시간표 생성 오류:', error);
      throw error;
    }
  },
  
  // 시간표 수정
  updateTimetable: async (timetable: { id: number; name?: string; semester?: string; is_active?: boolean }) => {
    try {
      const response = await fetch('/api/timetable', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetable)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '시간표 수정 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('시간표 수정 오류:', error);
      throw error;
    }
  },
  
  // 시간표 삭제
  deleteTimetable: async (id: number) => {
    try {
      const response = await fetch(`/api/timetable?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '시간표 삭제 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('시간표 삭제 오류:', error);
      throw error;
    }
  },
  
  // 시간표 수업 목록 조회
  getClasses: async (timetableId: number) => {
    try {
      const response = await fetch(`/api/timetable/classes?timetable_id=${timetableId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '수업 목록을 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('수업 목록 조회 오류:', error);
      throw error;
    }
  },
  
  // 시간표에 수업 추가
  addClass: async (classData: {
    timetable_id: number;
    subject: string;
    location?: string;
    day: string;
    start_hour: number;
    end_hour: number;
    color?: string;
  }) => {
    try {
      const response = await fetch('/api/timetable/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '수업 추가 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('수업 추가 오류:', error);
      throw error;
    }
  },
  
  // 시간표 수업 삭제
  deleteClass: async (id: number) => {
    try {
      const response = await fetch(`/api/timetable/classes?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '수업 삭제 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('수업 삭제 오류:', error);
      throw error;
    }
  }
};

// 중고장터 관련 API
export const marketplaceApi = {
  // 상품 목록 조회
  getProducts: async (params?: { category?: string; search?: string; limit?: number; offset?: number }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      
      const response = await fetch(`/api/marketplace?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '상품 목록을 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
      throw error;
    }
  },
  
  // 특정 상품 조회
  getProduct: async (id: number) => {
    try {
      const response = await fetch(`/api/marketplace?id=${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '상품을 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('상품 조회 오류:', error);
      throw error;
    }
  },
  
  // 상품 등록
  createProduct: async (product: {
    title: string;
    price: number;
    description: string;
    category: string;
    condition?: string;
    image_url?: string;
  }) => {
    try {
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '상품 등록 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('상품 등록 오류:', error);
      throw error;
    }
  },
  
  // 상품 정보 수정
  updateProduct: async (product: {
    id: number;
    title?: string;
    price?: number;
    description?: string;
    category?: string;
    condition?: string;
    image_url?: string;
    status?: string;
  }) => {
    try {
      const response = await fetch('/api/marketplace', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '상품 정보 수정 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('상품 정보 수정 오류:', error);
      throw error;
    }
  },
  
  // 상품 삭제
  deleteProduct: async (id: number) => {
    try {
      const response = await fetch(`/api/marketplace?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '상품 삭제 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      throw error;
    }
  }
};

// 카풀 관련 API
export const carpoolApi = {
  // 카풀 목록 조회
  getCarpools: async (params?: { type?: string; my?: boolean; limit?: number; offset?: number }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.my) queryParams.append('my', 'true');
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      
      const response = await fetch(`/api/carpool?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '카풀 목록을 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('카풀 목록 조회 오류:', error);
      throw error;
    }
  },
  
  // 특정 카풀 조회
  getCarpool: async (id: number) => {
    try {
      const response = await fetch(`/api/carpool?id=${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '카풀을 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('카풀 조회 오류:', error);
      throw error;
    }
  },
  
  // 카풀 등록
  createCarpool: async (carpool: {
    departure: string;
    destination: string;
    carpool_date: string;
    carpool_time: string;
    max_participants: number;
    vehicle_type: string;
    trip_type: string;
    estimated_cost?: string;
    carpool_type?: string;
  }) => {
    try {
      const response = await fetch('/api/carpool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carpool)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '카풀 등록 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('카풀 등록 오류:', error);
      throw error;
    }
  },
  
  // 카풀 참가 신청
  joinCarpool: async (carpoolId: number) => {
    try {
      const response = await fetch('/api/carpool/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carpool_id: carpoolId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '카풀 참가 신청 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('카풀 참가 신청 오류:', error);
      throw error;
    }
  },
  
  // 카풀 참가 취소
  cancelParticipation: async (carpoolId: number) => {
    try {
      const response = await fetch(`/api/carpool/participants?carpool_id=${carpoolId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '카풀 참가 취소 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('카풀 참가 취소 오류:', error);
      throw error;
    }
  }
};

// 학식 관련 API
export const hansikApi = {
  // 학식 메뉴 조회
  getMenu: async (day?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (day) queryParams.append('day', day);
      
      const response = await fetch(`/api/hansik?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '학식 메뉴를 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('학식 메뉴 조회 오류:', error);
      throw error;
    }
  },
  
  // 즐겨찾기 목록 조회
  getFavorites: async () => {
    try {
      const response = await fetch('/api/hansik/favorites');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '즐겨찾기 목록을 가져오는 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('즐겨찾기 목록 조회 오류:', error);
      throw error;
    }
  },
  
  // 즐겨찾기 추가
  addFavorite: async (favorite: { restaurant_name: string; menu_name: string; menu_type?: string }) => {
    try {
      const response = await fetch('/api/hansik/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorite)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '즐겨찾기 추가 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('즐겨찾기 추가 오류:', error);
      throw error;
    }
  },
  
  // 즐겨찾기 삭제
  deleteFavorite: async (id: number) => {
    try {
      const response = await fetch(`/api/hansik/favorites?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '즐겨찾기 삭제 중 오류가 발생했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('즐겨찾기 삭제 오류:', error);
      throw error;
    }
  }
};
