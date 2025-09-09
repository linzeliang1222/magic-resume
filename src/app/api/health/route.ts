import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    // 检查基本服务是否正常
    const isHealthy = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        server: 'ok',
        fonts: fs.existsSync('public/fonts/MiSans-VF.ttf') ? 'ok' : 'warning',
        chromium: 'unknown'
      }
    };

    // 检查Chromium是否可用
    const chromiumPaths = [
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/opt/google/chrome/chrome'
    ];

    const availableChromium = chromiumPaths.find(path => fs.existsSync(path));
    if (availableChromium) {
      isHealthy.checks.chromium = 'ok';
    } else {
      try {
        const chromium = await import('@sparticuz/chromium');
        await chromium.executablePath();
        isHealthy.checks.chromium = 'ok';
      } catch {
        isHealthy.checks.chromium = 'error';
      }
    }

    return NextResponse.json(isHealthy, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}