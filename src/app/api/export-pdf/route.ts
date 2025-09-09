import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  let browser;

  try {
    const { content, styles, margin = 16 } = await req.json();

    if (!content) {
      return NextResponse.json(
          { error: 'Content is required' },
          { status: 400 }
      );
    }

    // 检查是否为开发环境
    const isDev = process.env.NODE_ENV === 'development';
    // 检查是否在Docker环境中
    const isDocker = process.env.DOCKER === 'true' || fs.existsSync('/.dockerenv');

    // 配置 Puppeteer
    if (isDev && !isDocker) {
      // 开发环境使用本地 Chrome
      const puppeteerFull = await import('puppeteer');

      // macOS Chrome 路径
      const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

      browser = await puppeteerFull.default.launch({
        headless: true,
        executablePath: chromePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--hide-scrollbars',
          '--disable-web-security'
        ]
      });
    } else {
      // 生产环境或Docker环境使用 Chromium
      let executablePath;
      
      try {
        // 尝试使用 @sparticuz/chromium
        executablePath = await chromium.executablePath();
      } catch (error) {
        console.log('Chromium executablePath failed, trying alternatives:', (error as Error).message);
        
        // 备用方案：尝试系统安装的 Chromium 路径
        const commonChromiumPaths = [
          '/usr/bin/chromium-browser',  // Ubuntu/Debian
          '/usr/bin/chromium',          // Alpine/其他
          '/usr/bin/google-chrome',     // Google Chrome
          '/usr/bin/google-chrome-stable',
          '/opt/google/chrome/chrome'   // 容器中的Google Chrome
        ];
        
        for (const path of commonChromiumPaths) {
          if (fs.existsSync(path)) {
            executablePath = path;
            console.log('Found Chromium at:', path);
            break;
          }
        }
        
        if (!executablePath) {
          throw new Error('No Chromium executable found. Please install Chromium in your Docker container.');
        }
      }

      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--font-render-hinting=none',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--hide-scrollbars'
        ],
        executablePath,
        headless: chromium.headless || 'new'
      });
    }

    const page = await browser.newPage();

    // 加载字体文件并转换为base64内嵌
    const fontPath = path.join(process.cwd(), 'public/fonts/MiSans-VF.ttf');
    let fontBase64 = '';

    try {
      const fontBuffer = fs.readFileSync(fontPath);
      fontBase64 = fontBuffer.toString('base64');
      console.log('Font loaded successfully, size:', (fontBuffer.length / 1024 / 1024).toFixed(2), 'MB');
    } catch (fontError) {
      console.error('Font file loading failed:', fontError);
    }

    // 构建字体CSS - 使用base64内嵌确保字体可用
    const fontCSS = fontBase64 ? `
      @font-face {
        font-family: "MiSans VF";
        src: url("data:font/truetype;charset=utf-8;base64,${fontBase64}") format("truetype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    ` : `
      @font-face {
        font-family: "MiSans VF";
        src: url("/fonts/MiSans-VF.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;

    // 构建完整的 HTML - 确保字体一致性
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Resume</title>
          <style>
            ${fontCSS}

            @page {
              size: A4;
              padding: 0;
            }
            
            * {
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              background: white;
              font-family: "MiSans VF", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: "MiSans VF", sans-serif;
            }

            #resume-preview {
              padding: 0 !important;
              margin: 0 !important;
              font-family: "MiSans VF", sans-serif !important;
            }

            #print-content {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              padding: 0;
              background: white;
              box-shadow: none;
              font-family: "MiSans VF", sans-serif !important;
            }
            
            #print-content * {
              box-shadow: none !important;
              transform: none !important;
              scale: 1 !important;
              font-family: inherit !important;
            }
            
            .scale-90 {
              transform: none !important;
            }
            
            .page-break-line {
              display: none;
            }

            /* 强制所有文本元素使用 MiSans VF 字体 */
            h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, a, label, input, textarea, select, button {
              font-family: "MiSans VF", sans-serif !important;
            }

            /* 应用所有样式表样式 */
            ${styles || ''}
          </style>
        </head>
        <body>
          <div id="print-content">
            ${content}
          </div>
        </body>
      </html>
    `;

    // 设置页面内容 - 简化等待方式
    await page.setContent(pdfContent, {
      waitUntil: ['domcontentloaded'],
      timeout: 60000 // 增加超时时间
    });

    // 等待字体加载完成
    // @ts-ignore
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // 等待确保字体完全渲染
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成 PDF - 使用毫米单位与CSS像素进行精确匹配
    const marginMM = (margin * 0.264583).toFixed(2); // px to mm 转换
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: `${marginMM}mm`,
        right: `${marginMM}mm`,
        bottom: `${marginMM}mm`,
        left: `${marginMM}mm`
      }
    });

    await browser.close();

    // 返回 PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);

    // 确保浏览器被关闭
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: 500 }
    );
  }
}