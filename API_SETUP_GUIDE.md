# 🔐 دليل إعداد المفاتيح الآمن - جولان 24

## ⚠️ **تحذير أمني مهم**

**لا تضع مفتاح OpenAI API في الكود مباشرة!** سيتم رفعه على GitHub ويكون مرئياً للجميع.

## 🔒 **الطريقة الصحيحة والأمنة**

### 1. **إنشاء ملف .env محلي**

في مجلد `backend/` أنشئ ملف `.env`:

```bash
# في مجلد backend/
touch .env  # Linux/Mac
# أو
echo. > .env  # Windows
```

### 2. **إضافة المفتاح في ملف .env**

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# Database Configuration
DATABASE_URL=postgresql://news_user:news_password@localhost:5432/news_db
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-change-this-in-production

# System Configuration
FLASK_ENV=development
DEBUG=True
```

### 3. **تأكد من أن .env محمي**

ملف `.gitignore` يحتوي بالفعل على:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

هذا يعني أن ملف `.env` لن يتم رفعه على GitHub.

### 4. **الحصول على مفتاح OpenAI API**

1. اذهب إلى: https://platform.openai.com/api-keys
2. سجل دخول أو أنشئ حساب
3. انقر على "Create new secret key"
4. انسخ المفتاح (يبدأ بـ `sk-`)

### 5. **اختبار المفتاح**

```bash
cd backend
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
print('✅ API Key loaded successfully' if api_key else '❌ API Key not found')
"
```

## 🚀 **تشغيل النظام مع المفتاح**

### الطريقة المحلية:
```bash
cd backend
python main.py
```

### الطريقة مع Docker:
```bash
# إضافة متغير البيئة
export OPENAI_API_KEY=sk-your-key-here
docker-compose up -d
```

## 🔍 **فحص الأمان**

### تأكد من أن المفتاح محمي:
```bash
# تحقق من أن .env غير موجود في Git
git status
# يجب ألا ترى .env في القائمة
```

### فحص أن المفتاح يعمل:
```bash
curl http://localhost:5000/api/ai-status
```

## ⚡ **للنشر على الإنترنت**

### Heroku:
```bash
heroku config:set OPENAI_API_KEY=sk-your-key-here
```

### DigitalOcean/AWS:
```bash
# أضف المتغير في لوحة التحكم
OPENAI_API_KEY=sk-your-key-here
```

## 🛡️ **أفضل الممارسات الأمنية**

1. **لا تشارك المفتاح أبداً** في الكود أو المحادثات
2. **استخدم متغيرات البيئة** دائماً
3. **غير المفتاح دورياً** كل 3-6 أشهر
4. **راقب الاستخدام** في لوحة تحكم OpenAI
5. **استخدم مفاتيح مختلفة** للتطوير والإنتاج

## 🎯 **الخطوات السريعة**

1. **أنشئ ملف `.env` في مجلد `backend/`**
2. **أضف مفتاح OpenAI API**
3. **اختبر النظام**
4. **انشر بأمان**

---

**تذكر: الأمان أولاً! لا تضع المفاتيح في الكود أبداً.** 🔐
