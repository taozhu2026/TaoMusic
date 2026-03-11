import { normalizeCatalog } from './helpers';
import { CHINESE_CATALOG } from './chinese';
import { GLOBAL_CATALOG } from './global';
import { JAPANESE_CATALOG } from './japanese';
import { KOREAN_CATALOG } from './korean';

export const LOCAL_CATALOG = normalizeCatalog([
  ...CHINESE_CATALOG,
  ...JAPANESE_CATALOG,
  ...KOREAN_CATALOG,
  ...GLOBAL_CATALOG,
]);
