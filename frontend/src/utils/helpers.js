// Validate URL to ensure it's a valid image URL
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// Get safe image URL or fallback to placeholder
export const getSafeImageUrl = (url, placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E') => {
  if (isValidImageUrl(url)) {
    return url;
  }
  return placeholder;
};

// Format date to YYYY-MM-DD
export const formatDateForInput = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};
