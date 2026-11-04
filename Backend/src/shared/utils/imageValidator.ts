export interface ImageValidationResult {
  isValid: boolean;
  mimeType: string;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Validates uploaded image bytes against strict criteria:
 * - Non-empty
 * - Size limit (<= 10MB)
 * - Minimum valid image header length
 * - Verified magic numbers for JPEG, PNG, and WEBP
 */
export function validateImageBuffer(buffer?: Buffer | null): ImageValidationResult {
  if (!buffer || buffer.length === 0) {
    return {
      isValid: false,
      mimeType: '',
      error: 'Empty image file. Please upload a valid photograph of your meal.',
    };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      mimeType: '',
      error: 'Image file size exceeds the 10MB limit. Please upload a smaller image.',
    };
  }

  // Minimum header size to inspect magic numbers
  if (buffer.length < 24) {
    return {
      isValid: false,
      mimeType: '',
      error: 'Corrupted or unreadable image file. Please upload a complete photograph.',
    };
  }

  // Check JPEG magic numbers: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return {
      isValid: true,
      mimeType: 'image/jpeg',
    };
  }

  // Check PNG magic numbers: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return {
      isValid: true,
      mimeType: 'image/png',
    };
  }

  // Check WEBP magic numbers: RIFF (bytes 0-3) and WEBP (bytes 8-11)
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return {
      isValid: true,
      mimeType: 'image/webp',
    };
  }

  return {
    isValid: false,
    mimeType: '',
    error: 'Unsupported image format. Only JPEG, PNG, and WEBP photographs are supported.',
  };
}

