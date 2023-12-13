export const formatHelper = (str: string) => {
  const formattedStr = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return formattedStr;
};

export const renderEnvVarValue = (value) => {
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
};
