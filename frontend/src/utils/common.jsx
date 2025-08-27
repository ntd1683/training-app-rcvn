import DOMPurify from 'dompurify';

export const checkRoleAndPermission = (permission, userInfo) => {
  if (!userInfo) return false;
  const user = userInfo;

  if (user.group_role === 'Admin' || user.group_role === 'SuperAdmin') {
    return true;
  }

  if (user.permissions && user.permissions.length > 0) {
    return user.permissions.includes(permission);
  }
}

export const capitalizeEachWord = (str) => {
  if (!str) return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getUrlPrefix = (location) => {
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
  return pathSegments[0] || '';
};

export const formatPrice = (price, currency = 'USD') => {
  if (typeof price !== 'number') {
    return price;
  }

  let locale;
  switch (currency) {
    case 'VND':
      locale = 'vi-VN';
      break;
    case 'JPY':
      locale = 'ja-JP';
      break;
    case 'USD':
    default:
      locale = 'en-US';
      break;
  }

  return price.toLocaleString(locale, { style: 'currency', currency });
}

export const stripHtmlAndTruncate = (html, maxLength = 50) => {
  if (!html) return 'Không có mô tả';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  if (textContent.length > maxLength) {
    return `${textContent.substring(0, maxLength)}...`;
  }

  return textContent;
};

export const sanitizeContent = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const shortenText = (str) => {
  if (!str) return '';
  if (str.length <= 19) return str;

  const first = str.slice(0, 8);
  const last = str.slice(-8);
  return `${first}...${last}`;
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' ' + date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export const combinedAddress = (address, ward, district, province) => {
    return (address ? address + ', ' : '') + 
    (ward ? ward + ', ' : '') +
    (district ? district + ', ' : '') + 
    (province ? province : '');
}