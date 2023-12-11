export const checkMissingFields = (fieldsList: string[], payloadObject: any) => {
  let isMissing = false;

  fieldsList.forEach((field) => {
    if (
      !payloadObject[field] ||
      payloadObject[field] === '' ||
      payloadObject[field] === undefined
    ) {
      isMissing = true;
    }
  });

  return isMissing;
};
