import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
  SCENIC_VIEWS = 'SCENIC VIEWS',           // 🌆 City view, sunset/sunrise joylar
  PHOTO_SPOTS = 'PHOTO SPOTS',             // 📷 Instagram-friendly joylar
  UNIQUE_CAFES = 'UNIQUE CAFES',           // ☕ Konseptual, go‘zal, dam olish uchun
  CULTURAL_PLACES = 'CULTURAL PLACES',     // 🎨 Muzey, teatr, tarixiy joylar
  NIGHT_VIBES = 'NIGHT VIBES',             // 🌙 Night view, light, music joylar
  RELAXING_SPOTS = 'RELAXING SPOTS',       // 🧘 Park, forest walk, jim joylar
  EVENTS_FESTIVALS = 'EVENTS & FESTIVALS', // 🎉 Festival, bazar, ochiq tadbirlar
  HIDDEN_SPOTS = 'HIDDEN SPOTS',           // 🚪 Kam taniqli, go‘zal joylar
  HALAL_RESTAURANTS = 'HALAL RESTAURANTS', // 🍛 Halal restoranlar
  MOSQUES = 'MOSQUES',                     // 🕌 Masjidlar
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
