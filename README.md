# Atletik Güç & Beslenme / Athletic Power & Nutrition

12 haftalık antrenman programını, günlük beslenme makrolarını, market bütçesini ve mutfak stoğunu tek yerden takip eden bir Expo (React Native) mobil uygulaması.
An Expo (React Native) app for tracking a 12-week training program, daily nutrition macros, grocery budget and pantry stock in one place.

**Diller / Languages:** Türkçe, English (sağ üstteki `EN` / `TR` butonu · the `EN` / `TR` button at the top right)

- [Türkçe Kurulum](#türkçe-kurulum)
- [English Setup](#english-setup)

---

## Türkçe Kurulum

### Gereksinimler
- [Node.js](https://nodejs.org/) 20 veya üzeri
- npm (Node.js ile birlikte gelir)
- Telefonda test için: [Expo Go](https://expo.dev/go). Uygulama Expo SDK 55 kullanır, Expo Go'nun güncel olduğundan emin ol.
- İsteğe bağlı: Android Studio (emülatör) veya Xcode (iOS simülatörü, sadece macOS)

### 1. Projeyi indir
```bash
git clone https://github.com/alperyoltay/atletik-guc.git
cd atletik-guc
```

### 2. Bağımlılıkları kur
```bash
npm install
```

### 3. Uygulamayı başlat
```bash
npx expo start
```
Terminalde çıkan QR kodu telefondaki **Expo Go** ile okut. Ya da:
- `a` tuşu → Android emülatöründe açar
- `i` tuşu → iOS simülatöründe açar (macOS)
- `w` tuşu → tarayıcıda açar

### 4. Dil seçimi
Uygulama ilk açılışta telefonun diline göre Türkçe ya da İngilizce başlar. Değiştirmek için her ekranın sağ üstündeki **EN** / **TR** butonuna dokun. Seçim kaydedilir.

### 5. APK oluşturma (isteğe bağlı)
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
Derleme bitince EAS bir indirme bağlantısı verir. Kendi Expo hesabınla derleyeceksen `app.json` içindeki `owner` ve `extra.eas.projectId` alanlarını sil, ardından `eas init` çalıştır.

### Ekranlar
- **Özet:** Hafta seçimi (12 hafta, her 4. hafta deload), günün antrenmanı, kalori/protein ilerlemesi, bütçe ve kilo takibi.
- **Antrenman:** Günlük egzersiz listesi, set/tekrar, hedef ağırlıklar ve dinlenme sayacı.
- **Beslenme:** Menü şablonu seçimi ve öğün kontrol listesi. İşaretlenen öğünler stoktan düşer.
- **Market & Stok:** Haftalık alışveriş listesi, fiyat düzenleme ve dijital kiler.

---

## English Setup

### Requirements
- [Node.js](https://nodejs.org/) 20 or newer
- npm (comes with Node.js)
- To test on a phone: [Expo Go](https://expo.dev/go). The app uses Expo SDK 55, so make sure Expo Go is up to date.
- Optional: Android Studio (emulator) or Xcode (iOS simulator, macOS only)

### 1. Clone the project
```bash
git clone https://github.com/alperyoltay/atletik-guc.git
cd atletik-guc
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the app
```bash
npx expo start
```
Scan the QR code shown in the terminal with **Expo Go** on your phone. Or press:
- `a` to open on an Android emulator
- `i` to open on the iOS simulator (macOS)
- `w` to open in the browser

### 4. Choosing a language
On first launch the app picks Turkish or English based on your phone's language. To switch, tap the **EN** / **TR** button at the top right of any screen. Your choice is saved.

### 5. Building an APK (optional)
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
When the build finishes, EAS gives you a download link. To build with your own Expo account, remove `owner` and `extra.eas.projectId` from `app.json`, then run `eas init`.

### Screens
- **Summary:** Week picker (12 weeks, every 4th week is a deload), today's workout, calorie/protein progress, budget and weight tracking.
- **Workout:** Daily exercise list with sets/reps, target weights and a rest timer.
- **Nutrition:** Pick a menu template and tick off meals. Checked meals are taken out of stock.
- **Grocery & Stock:** Weekly shopping list, price editing and a digital pantry.

---

## Proje Yapısı / Project Structure
```
src/
├── app/            Ekranlar / Screens (expo-router)
├── components/     Ortak bileşenler / Shared components
├── constants/      Program, menü ve market verileri / Program, menu & grocery data
├── i18n/           Çeviriler / Translations (tr, en)
├── store/          Uygulama durumu / App state (zustand)
└── types/          TypeScript tipleri / Types
```
