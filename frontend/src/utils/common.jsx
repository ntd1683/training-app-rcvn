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