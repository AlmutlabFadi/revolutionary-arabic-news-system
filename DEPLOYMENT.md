# نظام الأخبار المتقدم - دليل النشر

## 🚀 النشر السريع

### متطلبات النظام
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### خطوات النشر

#### 1. النشر باستخدام Docker (الطريقة المفضلة)
```bash
# استنساخ المشروع
git clone <repository-url>
cd advanced-news-system

# إنشاء ملف البيئة
cp .env.example .env
# تحديث المتغيرات في .env

# تشغيل النظام الكامل
docker-compose up -d

# التحقق من الحالة
docker-compose ps
```

#### 2. النشر اليدوي للتطوير
```bash
# تشغيل الخادم الخلفي
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# تشغيل الواجهة الأمامية (في terminal آخر)
cd frontend
npm install
npm run dev
```

#### 3. اختبار النظام
```bash
# اختبار سريع
chmod +x quick-test.sh
./quick-test.sh

# اختبار شامل
chmod +x test-system.sh
./test-system.sh
```

## 🔧 الإعدادات

### متغيرات البيئة المطلوبة
```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/news_db
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### إعدادات الأتمتة
- **فترة السحب**: 5 دقائق (قابلة للتعديل)
- **معالجة AI**: مفعلة افتراضياً
- **النشر التلقائي**: مفعل افتراضياً
- **الحد الأقصى للمقالات**: 10 لكل مصدر

## 📊 مراقبة الأداء

### مؤشرات الأداء الرئيسية
- **وقت المعالجة**: < 60 ثانية مضمون
- **معدل النجاح**: > 95%
- **توفر النظام**: 99.9%
- **دقة التصنيف**: > 90%

### نقاط الوصول
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Performance Metrics**: http://localhost:5000/api/automation/performance

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. فشل في بدء الخدمات
```bash
# التحقق من Docker
docker --version
docker-compose --version

# إعادة بناء الحاويات
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### 2. مشاكل قاعدة البيانات
```bash
# إعادة تهيئة قاعدة البيانات
docker-compose down -v
docker-compose up -d
```

#### 3. مشاكل الشبكة
```bash
# التحقق من المنافذ
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# إعادة تشغيل الخدمات
docker-compose restart
```

## 🚀 النشر في الإنتاج

### 1. إعداد الخادم
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. إعداد البيئة
```bash
# إنشاء مستخدم للتطبيق
sudo useradd -m -s /bin/bash newsapp
sudo usermod -aG docker newsapp

# نسخ الملفات
sudo -u newsapp git clone <repository-url> /home/newsapp/advanced-news-system
cd /home/newsapp/advanced-news-system

# إعداد متغيرات البيئة
sudo -u newsapp cp .env.example .env
sudo -u newsapp nano .env  # تحديث القيم
```

### 3. تشغيل النظام
```bash
# بدء الخدمات
sudo -u newsapp docker-compose -f docker-compose.yml up -d

# إعداد خدمة systemd
sudo tee /etc/systemd/system/advanced-news.service > /dev/null <<EOF
[Unit]
Description=Advanced News System
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/newsapp/advanced-news-system
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=newsapp

[Install]
WantedBy=multi-user.target
EOF

# تفعيل الخدمة
sudo systemctl enable advanced-news.service
sudo systemctl start advanced-news.service
```

## 📈 التحسين والصيانة

### 1. النسخ الاحتياطية
```bash
# نسخ احتياطي لقاعدة البيانات
docker-compose exec postgres pg_dump -U news_user news_db > backup_$(date +%Y%m%d).sql

# نسخ احتياطي للملفات
tar -czf backup_files_$(date +%Y%m%d).tar.gz /home/newsapp/advanced-news-system
```

### 2. التحديثات
```bash
# تحديث الكود
git pull origin main

# إعادة بناء ونشر
docker-compose down
docker-compose build
docker-compose up -d
```

### 3. المراقبة
```bash
# مراقبة السجلات
docker-compose logs -f

# مراقبة الأداء
docker stats

# فحص الصحة
curl http://localhost:5000/api/health
```

## 🔒 الأمان

### إعدادات الأمان المطلوبة
1. تغيير كلمات المرور الافتراضية
2. تفعيل HTTPS
3. إعداد جدار الحماية
4. تحديث النظام بانتظام
5. مراقبة السجلات

### جدار الحماية
```bash
# السماح بالمنافذ المطلوبة فقط
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

**نظام الأخبار المتقدم** - نشر احترافي لثورة الإعلام الذكي 🚀
