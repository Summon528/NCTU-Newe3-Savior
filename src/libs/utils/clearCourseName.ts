import isEn from './isEn';

export default function clearCourseName(name: string | null): string {
  if (name === null) {
    return '';
  }
  const regex = /.*】\d*([^ ]*)(.*)/;
  const match = regex.exec(name);
  if (match === null || match.length < 3) {
    return name;
  }
  if (isEn) {
    return match[2].trim();
  } else {
    return match[1].trim();
  }
}
