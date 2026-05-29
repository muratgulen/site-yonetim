# Site Yönetim Uygulaması — CLAUDE.md

## Proje Hakkında
Apartman ve site yöneticileri için not tutma ve takip uygulaması.
İlk versiyon sadece yönetici kullanımı içindir, kullanıcı girişi yoktur.

## Teknoloji
- React Native + Expo (SDK 56)
- Local storage (AsyncStorage) — ilk versiyon
- Modüler yapı (ilerleyen versiyonlarda login, sosyal özellikler eklenecek)

## Modüller (v1)

1. Sakinler — isim, blok, daire no, iletişim bilgisi
2. Aidat Takibi — kim ödedi, kim ödemedi, ay bazlı
3. Giderler — tarih, tutar, açıklama
4. Kayıt Defteri — serbest not, toplantı kararları

## Kurallar

- Kod sade ve okunabilir olsun
- Her modül kendi klasöründe olsun
- Türkçe içerik, İngilizce kod

## Gelecek Versiyon Planı

### Login Sistemi (Kademeli)
- v2: Sadece yönetici login (Firebase Auth)
- v3: Yönetici yardımcısı (kısıtlı yetki, RBAC)
- v4: Tüm sakinler (sadece kendi bilgileri)

### Migrasyon Notu
Login versiyonuna geçerken AsyncStorage'daki mevcut veriyi
Firebase'e taşıyan bir migrasyon akışı yazılmalı.
İlk açılışta kullanıcıya sor, onay alınca taşı.

## Bilinen Teknik Borçlar

### Daire Geçmiş Kaydı (Audit Trail)
Şu an sakin değişikliği üzerine yazıyor, geçmiş kaydı tutulmuyor.
İleride her daire için "tarih aralığı + kişi" bazlı geçmiş tutulmalı.
Aidat dönemi (ayın kaçından kaçına) bilgisi de eklenmeli.
Sakin değişikliğinde eski aylar etkilenmemeli.
Bu değişiklik sakin modülü, aidat modülü ve storage katmanını etkiler — 
mevcut veri yapısıyla uyumsuz, ayrı bir versiyon olarak planlanmalı.