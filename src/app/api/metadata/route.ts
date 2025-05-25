import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL이 필요합니다.' }, { status: 400 });
    }

    // URL 유효성 검사
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: '유효하지 않은 URL입니다.' }, { status: 400 });
    }

    // 메타데이터 가져오기
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10초 타임아웃
    });

    if (!response.ok) {
      return NextResponse.json({ error: '페이지를 가져올 수 없습니다.' }, { status: 400 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 메타데이터 추출
    const metadata = {
      title: 
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('title').text() ||
        '제목 없음',
      description:
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '설명 없음',
      image:
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        $('meta[name="twitter:image:src"]').attr('content') ||
        null,
      url: url
    };

    // 상대 경로 이미지 URL을 절대 경로로 변환
    if (metadata.image && !metadata.image.startsWith('http')) {
      const baseUrl = new URL(url);
      if (metadata.image.startsWith('//')) {
        metadata.image = baseUrl.protocol + metadata.image;
      } else if (metadata.image.startsWith('/')) {
        metadata.image = baseUrl.origin + metadata.image;
      } else {
        metadata.image = baseUrl.origin + '/' + metadata.image;
      }
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('메타데이터 가져오기 오류:', error);
    return NextResponse.json({ error: '메타데이터를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
