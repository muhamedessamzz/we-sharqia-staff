/**
 * Utility for parsing Google Drive & Docs links and converting them into
 * embedded in-platform preview iframe URLs.
 */

export function parseDriveLink(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  const url = rawUrl.trim();

  // 1. Google Drive File: /file/d/{FILE_ID}
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return {
      type: 'drive-file',
      fileId: fileMatch[1],
      embedUrl: `https://drive.google.com/file/d/${fileMatch[1]}/preview`,
      originalUrl: url
    };
  }

  // 2. Google Drive open?id={FILE_ID} or uc?id={FILE_ID}
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1] && url.includes('drive.google.com')) {
    return {
      type: 'drive-file',
      fileId: idMatch[1],
      embedUrl: `https://drive.google.com/file/d/${idMatch[1]}/preview`,
      originalUrl: url
    };
  }

  // 3. Google Docs: /document/d/{DOC_ID}
  const docMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch && docMatch[1]) {
    return {
      type: 'google-doc',
      fileId: docMatch[1],
      embedUrl: `https://docs.google.com/document/d/${docMatch[1]}/preview`,
      originalUrl: url
    };
  }

  // 4. Google Sheets: /spreadsheets/d/{SHEET_ID}
  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetMatch && sheetMatch[1]) {
    return {
      type: 'google-sheet',
      fileId: sheetMatch[1],
      embedUrl: `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/preview`,
      originalUrl: url
    };
  }

  // 5. Google Slides: /presentation/d/{SLIDE_ID}
  const slideMatch = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slideMatch && slideMatch[1]) {
    return {
      type: 'google-slide',
      fileId: slideMatch[1],
      embedUrl: `https://docs.google.com/presentation/d/${slideMatch[1]}/preview`,
      originalUrl: url
    };
  }

  // 6. Google Drive Folder: /drive/folders/{FOLDER_ID}
  const folderMatch = url.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return {
      type: 'drive-folder',
      fileId: folderMatch[1],
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#grid`,
      originalUrl: url
    };
  }

  // 7. YouTube Video
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      fileId: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`,
      originalUrl: url
    };
  }

  // 8. Generic URL (treat as generic web/pdf link via Google Docs Viewer)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return {
      type: 'generic-url',
      fileId: null,
      embedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
      originalUrl: url
    };
  }

  return null;
}

/**
 * Extracts the first URL or Google Drive link from a freeform text string.
 */
export function extractDriveUrl(text) {
  if (!text || typeof text !== 'string') return null;

  // Regex to detect URLs
  const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
  const matches = text.match(urlRegex);
  if (!matches || matches.length === 0) return null;

  // Prefer Google Drive / Docs URL if multiple exist
  const driveMatch = matches.find((m) => m.includes('drive.google.com') || m.includes('docs.google.com'));
  return driveMatch || matches[0];
}
