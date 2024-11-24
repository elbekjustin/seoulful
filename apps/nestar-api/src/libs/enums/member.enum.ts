import { registerEnumType } from '@nestjs/graphql';
// registerEnumType:
// NestJS GraphQL moduli bilan ishlaganda enum turlarini 
// GraphQL shemasida ishlatish uchun ro'yxatdan o'tkazadi.

export enum MemberType {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}
registerEnumType(MemberType, {
  name: 'MemberType',
});

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  DELETE = 'DELETE',
}
registerEnumType(MemberStatus, {
  name: 'MemberStatus',
});

export enum MemberAuthType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM',
}
registerEnumType(MemberAuthType, {
  name: 'MemberAuthType',
});
