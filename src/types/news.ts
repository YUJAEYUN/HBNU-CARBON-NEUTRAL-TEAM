export interface NewsMetadata {
  title: string;
  description: string;
  image: string | null;
  url: string;
}

export interface NewsItem {
  id: number;
  url: string;
  metadata?: NewsMetadata;
  loading?: boolean;
  error?: string;
  // 기본 fallback 데이터
  fallback: {
    title: string;
    content: string;
    date: string;
    color: string;
    icon: string;
    category: string;
  };
}
