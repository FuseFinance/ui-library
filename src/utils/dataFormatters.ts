import { validate } from 'uuid';
import { KeyValueObj } from '../components/RequestParameters/types';
import { FeaturedBranch } from '@/src/types/services/environment';
import { Version } from '../types/services/versions';

const findInBranches = (selected: string, branches: FeaturedBranch[]) =>
  branches.find((b) => b.name === selected);
const findInVersionsByVerionNumber = (selected: string, versions: Version[]) =>
  versions.find((b) => b.versionNumber === selected);

const findInVersionsByVerionId = (selected: string, versions: Version[]) =>
  versions.find((b) => b.id === selected);

export const isPublishedVersion = (version: Version) => !!version.deployedAt;

export const findVersion = (selected: string, versions: Version[]) => {
  const found = validate(selected)
    ? findInVersionsByVerionId(selected, versions)
    : findInVersionsByVerionNumber(selected, versions);
  return found;
};

export const findEnvironment = (selected: string, environments: FeaturedBranch[]) => {
  const found = findInBranches(selected, environments);
  return found;
};

export const objectToArrayObjKeyValueFormater = (obj: object): KeyValueObj[] => {
  const formattedObjList: any = [];
  if (!obj) return [{ key: '', value: '' }];
  if (Object.keys(obj).length === 0) return [{ key: '', value: '' }];

  Object.keys(obj).forEach((key) => {
    const formattedObj: any = {
      key: key,
      value: obj[key],
    };
    formattedObjList.push(formattedObj);
  });

  return formattedObjList;
};

export const arrayObjKeyValueToObjectFormater = (array: KeyValueObj[]): object => {
  if (!array) return {};
  if (array.length === 0) return {};
  const obj = array.reduce((acc, curr) => {
    if (!curr.key || !curr.value) return acc;
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  return obj;
};

export const stringifyIfNotString = (value: string | object) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value, null, 2);
};
