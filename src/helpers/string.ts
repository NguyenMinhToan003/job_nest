export function cleanNameDistrict(name: string): string {
  const prefixes = [
    'Thành phố ',
    'Quận ',
    'Huyện ',
    'Xã ',
    'Thị xã ',
    'Thị trấn ',
  ];
  let cleanedName = name;
  const arrayName = name.split(' ');

  if (arrayName.length <= 2) return name;

  for (const prefix of prefixes) {
    if (cleanedName.startsWith(prefix)) {
      cleanedName = cleanedName.replace(prefix, '');
      break;
    }
  }
  return cleanedName;
}

export function cleanNameProvince(name: string): string {
  const prefixes = ['Thành phố ', 'Tỉnh '];
  let cleanedName = name;
  for (const prefix of prefixes) {
    if (cleanedName.startsWith(prefix)) {
      cleanedName = cleanedName.replace(prefix, '');
      break;
    }
  }
  return cleanedName;
}
