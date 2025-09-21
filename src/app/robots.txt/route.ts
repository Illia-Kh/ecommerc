import { NextResponse } from 'next/server';

export function GET() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}