/** Maps backend specialty icon keys to display glyphs */
const SPECIALTY_ICON_MAP: Record<string, string> = {
  heart: '❤️',
  skin: '🩺',
  stethoscope: '🩹',
  female: '👩‍⚕️',
  child: '👶',
  brain: '🧠',
  bone: '🦴',
  eye: '👁️',
  ent: '👂',
  lung: '🫁',
};

export const resolveSpecialtyIcon = (icon?: string): string => {
  if (!icon) return '🩺';
  if (SPECIALTY_ICON_MAP[icon]) return SPECIALTY_ICON_MAP[icon];
  if (icon.length <= 3) return icon;
  return '🩺';
};

export const formatSlugAsTitle = (slug: string): string =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const pluralizeSpecialtyTitle = (label: string): string => {
  if (label.endsWith('ist')) return label.replace(/ist$/, 'ists');
  if (label.endsWith('ian')) return label.replace(/ian$/, 'ians');
  if (label.endsWith('logist')) return `${label}s`;
  return `${label}s`;
};
