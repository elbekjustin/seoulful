export enum Message {
	SOMETHING_WENT_WRONG = 'Something went wrong!',
	// Nimadir noto'g'ri ishladi!
	NO_DATA_FOUND = 'No data found!',
	// Ma'lumot topilmadi!
	CREATE_FAILED = 'Create failed!',
	// Yaratish muvaffaqiyatsiz tugadi!
	UPDATE_FAILED = 'Update failed!',
	// Yangilash muvaffaqiyatsiz tugadi!
	REMOVE_FAILED = 'Remove failed!',
	// O'chirish muvaffaqiyatsiz tugadi!
	UPLOAD_FAILED = 'Upload failed!',
	// Yuklash muvaffaqiyatsiz tugadi!
	BAD_REQUEST = 'Bad Request',
	// Noto'g'ri so'rov!
	NO_MEMBER_NICK = 'No member with that member nick!',
	// Ushbu nom bilan a'zo topilmadi!
	BLOCKED_USER = 'You have been blocked!',
	// Siz bloklangansiz!
	WRONG_PASSWORD = 'Wrong password, try again!',
	// Noto'g'ri parol, qayta urinib ko'ring!
	NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
	// Siz autentifikatsiyadan o'tmagansiz, iltimos, avval tizimga kiring!
	TOKEN_NOT_EXIST = 'Bearer Token is not provided!',
	// Token taqdim etilmagan!
	ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for members with specific roles!',
	// Faqat maxsus rollarga ega foydalanuvchilarga ruxsat berilgan!
	NOT_ALLOWED_REQUEST = 'Not Allowed Request!',
	// Ruxsat etilmagan so'rov!
	PROVIDE_ALLOWED_FORMAT = 'Please provide jpg, jpeg or png images!',
	// Iltimos, jpg, jpeg yoki png formatidagi rasmni taqdim eting!
	SELF_SUBSCRIPTION_DENIED = 'Self subscription is denied!',
	// O'z-o'zini obuna qilish taqiqlangan!
}
