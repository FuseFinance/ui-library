const formatDate = (dateString: string, shortVersion = false) => {
  if (!dateString) return '';
  return shortVersion
    ? Intl.DateTimeFormat('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        month: 'short',
        day: 'numeric',
      }).format(new Date(dateString))
    : Intl.DateTimeFormat('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(new Date(dateString));
};

export default formatDate;
