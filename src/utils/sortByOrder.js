// src/utils/sortByOrder.js
export const sortByOrder = (arr) => {
  return [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}