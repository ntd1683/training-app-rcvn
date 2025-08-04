export const checkRoleAndPermission = (permission) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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