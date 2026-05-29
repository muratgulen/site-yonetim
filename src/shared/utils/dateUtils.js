export function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR');
}

export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
