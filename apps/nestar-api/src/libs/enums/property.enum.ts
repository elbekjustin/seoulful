import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
  SCENIC_VIEWS = 'SCENIC_VIEWS',           // 🌆 City view, sunset/sunrise joylar
  PHOTO_SPOTS = 'PHOTO_SPOTS',             // 📷 Instagram-friendly joylar
  UNIQUE_CAFES = 'UNIQUE_CAFES',           // ☕ Konseptual, go‘zal, dam olish uchun
  CULTURAL_PLACES = 'CULTURAL_PLACES',     // 🎨 Muzey, teatr, tarixiy joylar
  NIGHT_VIBES = 'NIGHT_VIBES',             // 🌙 Night view, light, music joylar
  RELAXING_SPOTS = 'RELAXING_SPOTS',       // 🧘 Park, forest walk, jim joylar
  EVENTS_FESTIVALS = 'EVENTS_FESTIVALS',   // 🎉 Festival, bazar, ochiq tadbirlar
  HIDDEN_SPOTS = 'HIDDEN_SPOTS',           // 🚪 Kam taniqli, go‘zal joylar
  HALAL_RESTAURANTS = 'HALAL_RESTAURANTS', // 🍛 Halal restoranlar
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
  DONGDAEMUN = 'DONGDAEMUN',
  SEODAEMUN = 'SEODAEMUN',
  EUNPYEONG = 'EUNPYEONG',
  OTHER = 'OTHER',
}
registerEnumType(PropertyLocation, {
  name: 'PropertyLocation',
});
