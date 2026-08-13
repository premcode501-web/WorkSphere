export const formatDate = (d?: Date) => {
  const date = d ?? new Date();
  return date.toLocaleDateString();
};
