// Canary Landmine Generator (Zero-Width Steganography)

const CHAR_0 = '\u200B'; // Zero-Width Space
const CHAR_1 = '\u200C'; // Zero-Width Non-Joiner
const DELIMITER = '\u2060'; // Word Joiner (used to mark start/end of our hidden payload)

/**
 * Encodes a regular string into a sequence of invisible zero-width characters.
 */
function encodeToZeroWidth(tag: string): string {
  let zw = '';
  for (let i = 0; i < tag.length; i++) {
    // Get 8-bit binary representation of the character
    const bin = tag.charCodeAt(i).toString(2).padStart(8, '0');
    for (const bit of bin) {
      zw += bit === '1' ? CHAR_1 : CHAR_0;
    }
  }
  return DELIMITER + zw + DELIMITER;
}

/**
 * Decodes a sequence of invisible zero-width characters back into a string.
 */
function decodeFromZeroWidth(zwPayload: string): string {
  let decoded = '';
  for (let i = 0; i < zwPayload.length; i += 8) {
    const chunk = zwPayload.slice(i, i + 8);
    if (chunk.length < 8) break; // Corrupted payload
    
    let bin = '';
    for (const char of chunk) {
      bin += char === CHAR_1 ? '1' : '0';
    }
    decoded += String.fromCharCode(parseInt(bin, 2));
  }
  return decoded;
}

/**
 * Injects an invisible tag into the visible text.
 * We inject it immediately after the first character to ensure it's copied
 * if the user highlights the text, and harder for scrapers to strip accidentally.
 */
export function injectCanary(visibleText: string, tag: string): string {
  if (!visibleText || !tag) return visibleText;
  
  const payload = `PANDORA_CANARY:${tag}`;
  const invisiblePayload = encodeToZeroWidth(payload);
  
  if (visibleText.length === 1) {
    return visibleText + invisiblePayload;
  }
  
  return visibleText.charAt(0) + invisiblePayload + visibleText.slice(1);
}

/**
 * Scans text for any invisible Canary tags.
 */
export function extractCanary(scrapedText: string): string | null {
  if (!scrapedText) return null;
  
  // Regex to find content trapped between our DELIMITER characters
  // \u2060 is the delimiter, and it captures the \u200B and \u200C chars inside.
  const regex = new RegExp(`${DELIMITER}([\\u200B\\u200C]+)${DELIMITER}`);
  const match = scrapedText.match(regex);
  
  if (match && match[1]) {
    const decoded = decodeFromZeroWidth(match[1]);
    if (decoded.startsWith('PANDORA_CANARY:')) {
      return decoded.replace('PANDORA_CANARY:', '');
    }
  }
  
  return null;
}
