import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
  SCENIC_VIEWS = 'SCENIC_VIEWS', // 🌆 City view, sunset/sunrise joylar
  PHOTO_SPOTS = 'PHOTO_SPOTS', // 📷 Instagram-friendly joylar
  MOSQUES = 'MOSQUES', // 🕌 Masjidlar
  HALAL_SHOPS = 'HALAL_SHOPS', // 🛍️ Halal do‘konlar
  HALAL_RESTAURANTS = 'HALAL_RESTAURANTS', // 🍛 Halal restoranlar
  RELAX_CAFES = 'RELAX_CAFES', // ☕ Tinch kafelar
  CULTURE_HISTORY = 'CULTURE_HISTORY', // 🎨 Muzey, tarixiy joylar
  EVENTS_FESTIVALS = 'EVENTS_FESTIVALS', // 🎉 Tadbirlar
  HIDDEN_SPOTS = 'HIDDEN_SPOTS', // 🧘 Maxfiy, qiziqarli joylar
}
registerEnumType(PropertyType, {
  name: 'PropertyType',
});

export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN',
  DELETE = 'DELETE',
}
registerEnumType(PropertyStatus, {
  name: 'PropertyStatus',
});

export enum PropertyLocation {
  GANGNAM = 'GANGNAM',
  MAPO = 'MAPO',
  JONGNO = 'JONGNO',
  JUNG = 'JUNG',
  YONGSAN = 'YONGSAN',
  SONGPA = 'SONGPA',
  SEOCHO = 'SEOCHO',
  YEONGDEUNGPO = 'YEONGDEUNGPO',
  GWANAK = 'GWANAK',
  SEODAEMUN = 'SEODAEMUN',
  EUNPYEONG = 'EUNPYEONG',
  OTHER = 'OTHER',
}
registerEnumType(PropertyLocation, {
  name: 'PropertyLocation',
});
