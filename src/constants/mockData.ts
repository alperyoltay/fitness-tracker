import { Workout, TrainingDay, MenuTemplate, ShoppingItem, StockItem } from '../types';

// Initial Compound weight values to avoid magic numbers
export const INITIAL_BENCH_PRESS_WEIGHT = 60; // kg
export const INITIAL_PULLUP_ADDITIONAL_WEIGHT = 0; // kg (bodyweight start)
export const INITIAL_BARBELL_ROW_WEIGHT = 40; // kg
export const INITIAL_SQUAT_WEIGHT = 70; // kg
export const INITIAL_RUNNING_DISTANCE_METERS = 12000; // 12 km

export const INITIAL_WORKOUTS: Record<TrainingDay, Omit<Workout, 'completed'>> = {
  [TrainingDay.PAZARTESI]: {
    day: TrainingDay.PAZARTESI,
    name: "Patlayıcılık (Plyometrics)",
    exercises: [
      {
        id: "mon_squat_jump",
        name: "Squat Jump",
        sets: 2,
        reps: "5",
        restSeconds: 90,
        description: "Çömelip zıpla",
        isCompound: false,
        completed: false
      },
      {
        id: "mon_pogo_jump",
        name: "Pogo Jump",
        sets: 2,
        reps: "10",
        restSeconds: 60,
        description: "Küçük hızlı zıplamalar yap",
        isCompound: false,
        completed: false
      },
      {
        id: "mon_bounds",
        name: "Bounds (İleri Sıçrama)",
        sets: 2,
        reps: "20 m",
        restSeconds: 90,
        description: "Büyük adımlarla sıçrayarak koş",
        isCompound: false,
        completed: false
      },
      {
        id: "mon_skips",
        name: "Skips for Height",
        sets: 2,
        reps: "10",
        restSeconds: 60,
        description: "Dizlerini yukarı kaldırarak zıpla",
        isCompound: false,
        completed: false
      },
      {
        id: "mon_sprint",
        name: "30 m Sprint",
        sets: 2,
        reps: "4x30 m",
        restSeconds: 120,
        description: "Çok hızlı koş, 30 metreyi 4 kere yap",
        isCompound: false,
        completed: false
      }
    ]
  },
  [TrainingDay.SALI]: {
    day: TrainingDay.SALI,
    name: "Tüm Vücut Kuvvet",
    exercises: [
      {
        id: "tue_box_stepup",
        name: "Box Step-up",
        sets: 3,
        reps: "6",
        restSeconds: 90,
        description: "Kutunun üstüne çık in",
        isCompound: false,
        completed: false
      },
      {
        id: "tue_bench_press",
        name: "Bench Press",
        sets: 3,
        reps: "5",
        restSeconds: 120,
        description: "Yatarak ağırlık it (Ana Bileşik)",
        isCompound: true,
        targetWeightKg: INITIAL_BENCH_PRESS_WEIGHT,
        completed: false
      },
      {
        id: "tue_weighted_pullup",
        name: "Weighted Pull-Up",
        sets: 3,
        reps: "6",
        restSeconds: 120,
        description: "Ağırlıklı barfiks çek (Ana Bileşik)",
        isCompound: true,
        targetWeightKg: INITIAL_PULLUP_ADDITIONAL_WEIGHT,
        completed: false
      },
      {
        id: "tue_side_lunge",
        name: "Side Lunge",
        sets: 3,
        reps: "10",
        restSeconds: 60,
        description: "Yana doğru çömel",
        isCompound: false,
        completed: false
      },
      {
        id: "tue_pec_deck",
        name: "Pec Deck",
        sets: 3,
        reps: "8",
        restSeconds: 90,
        description: "Göğüs makinesini sıkıştır",
        isCompound: false,
        completed: false
      },
      {
        id: "tue_barbell_row",
        name: "Barbell Row",
        sets: 3,
        reps: "8",
        restSeconds: 90,
        description: "Eğilip bar çekme (Ana Bileşik)",
        isCompound: true,
        targetWeightKg: INITIAL_BARBELL_ROW_WEIGHT,
        completed: false
      },
      {
        id: "tue_weighted_leg_raise",
        name: "Weighted Leg Raise",
        sets: 3,
        reps: "10",
        restSeconds: 60,
        description: "Bacaklarını ağırlıkla kaldır",
        isCompound: false,
        completed: false
      }
    ]
  },
  [TrainingDay.CARSAMBA]: {
    day: TrainingDay.CARSAMBA,
    name: "Tempo Koşusu",
    exercises: [
      {
        id: "wed_tempo_run",
        name: "4x4 dk Koşu",
        sets: 4,
        reps: "4 dk",
        restSeconds: 120,
        description: "4 dakika %90 maxHR koş, aralarda 2 dk yavaş jog/yürü",
        isCompound: false,
        completed: false
      }
    ]
  },
  [TrainingDay.PERSEMBE]: {
    day: TrainingDay.PERSEMBE,
    name: "Üst Vücut",
    exercises: [
      {
        id: "thu_incline_bench",
        name: "Incline Bench Press",
        sets: 3,
        reps: "6",
        restSeconds: 90,
        description: "Eğik sehpada göğüs itişi",
        isCompound: false,
        completed: false
      },
      {
        id: "thu_lat_pulldown",
        name: "Lat Pulldown",
        sets: 3,
        reps: "8",
        restSeconds: 90,
        description: "Yukarıdan bar çekme (sırt)",
        isCompound: false,
        completed: false
      },
      {
        id: "thu_lateral_raise",
        name: "Lateral Raise",
        sets: 3,
        reps: "10",
        restSeconds: 60,
        description: "Yandan omuz kaldırma",
        isCompound: false,
        completed: false
      },
      {
        id: "thu_back_extension",
        name: "Back Extension",
        sets: 3,
        reps: "10",
        restSeconds: 60,
        description: "Bel ve sırt kaldırma",
        isCompound: false,
        completed: false
      },
      {
        id: "thu_bicep_curl",
        name: "Bicep Curl",
        sets: 3,
        reps: "12",
        restSeconds: 60,
        description: "Kol bükme (ön kol)",
        isCompound: false,
        completed: false
      },
      {
        id: "thu_triceps_ext",
        name: "Triceps Extension",
        sets: 3,
        reps: "12",
        restSeconds: 60,
        description: "Kol açma (arka kol)",
        isCompound: false,
        completed: false
      }
    ]
  },
  [TrainingDay.CUMA]: {
    day: TrainingDay.CUMA,
    name: "Atletik Alt Vücut",
    exercises: [
      {
        id: "fri_squat",
        name: "Squat",
        sets: 5,
        reps: "5",
        restSeconds: 120,
        description: "Çömel kalk (Ana Bileşik)",
        isCompound: true,
        targetWeightKg: INITIAL_SQUAT_WEIGHT,
        completed: false
      },
      {
        id: "fri_bulgarian_split",
        name: "Bulgarian Split Squat",
        sets: 3,
        reps: "8",
        restSeconds: 90,
        description: "Tek bacak eğilip kalkma",
        isCompound: false,
        completed: false
      },
      {
        id: "fri_cossack_squat",
        name: "Cossack Squat / Side Lunge",
        sets: 3,
        reps: "10",
        restSeconds: 60,
        description: "Yana ağırlık çekme",
        isCompound: false,
        completed: false
      },
      {
        id: "fri_standing_calf",
        name: "Standing Calf Raise",
        sets: 2,
        reps: "10",
        restSeconds: 60,
        description: "Parmak ucuna yükselme",
        isCompound: false,
        completed: false
      },
      {
        id: "fri_seated_calf",
        name: "Seated Calf Raise",
        sets: 2,
        reps: "10",
        restSeconds: 60,
        description: "Oturarak alt baldır çalışması",
        isCompound: false,
        completed: false
      }
    ]
  },
  [TrainingDay.CUMARTESI]: {
    day: TrainingDay.CUMARTESI,
    name: "Dayanıklılık Koşusu",
    exercises: [
      {
        id: "sat_long_run",
        name: "Uzun Koşu",
        sets: 1,
        reps: "12 km",
        restSeconds: 0,
        description: "Orta tempo (%80 maxHR) koşu",
        isCompound: false,
        distanceMeters: INITIAL_RUNNING_DISTANCE_METERS,
        completed: false
      }
    ]
  },
  [TrainingDay.PAZAR]: {
    day: TrainingDay.PAZAR,
    name: "Aktif Dinlenme & Mobilite",
    exercises: [
      {
        id: "sun_light_movement",
        name: "Hafif Hareket & Yürüyüş",
        sets: 1,
        reps: "1 set",
        restSeconds: 0,
        description: "Hafif yürüyüş veya bisiklet",
        isCompound: false,
        completed: false
      },
      {
        id: "sun_mobility",
        name: "Esneklik & Stretching",
        sets: 1,
        reps: "1 set",
        restSeconds: 0,
        description: "Tüm vücut esneme ve foam roller çalışması",
        isCompound: false,
        completed: false
      }
    ]
  }
};

export const MENU_TEMPLATES: MenuTemplate[] = [
  {
    id: "tavuklu",
    name: "Tavuk Ağırlıklı Menü",
    meals: [
      {
        name: "Kahvaltı",
        description: "4 yumurta + 80g yulaf + 200ml süt + 1 muz",
        ingredients: [
          { name: "Yumurta", amount: "4 adet", stockUnit: "Yumurta", stockDeductionAmount: 4 },
          { name: "Yulaf ezmesi", amount: "80 g", stockUnit: "Yulaf", stockDeductionAmount: 80 },
          { name: "Süt", amount: "200 ml", stockUnit: "Süt", stockDeductionAmount: 200 },
          { name: "Muz", amount: "1 adet", stockUnit: "Muz", stockDeductionAmount: 1 }
        ],
        protein: 38,
        calories: 780,
        completed: false
      },
      {
        name: "Kuşluk",
        description: "200g yoğurt + 30g fıstık ezmesi",
        ingredients: [
          { name: "Yoğurt", amount: "200 g", stockUnit: "Yoğurt", stockDeductionAmount: 200 },
          { name: "Fıstık ezmesi", amount: "30 g", stockUnit: "Fıstık Ezmesi", stockDeductionAmount: 30 }
        ],
        protein: 18,
        calories: 380,
        completed: false
      },
      {
        name: "Öğle",
        description: "200g tavuk göğsü + 250g pirinç pilavı",
        ingredients: [
          { name: "Tavuk göğsü", amount: "200 g", stockUnit: "Tavuk", stockDeductionAmount: 200 },
          { name: "Pirinç", amount: "250 g (pişmiş)", stockUnit: "Pirinç", stockDeductionAmount: 100 }
        ],
        protein: 52,
        calories: 850,
        completed: false
      },
      {
        name: "İkindi",
        description: "2 dilim lor peyniri + 1 elma",
        ingredients: [
          { name: "Lor peyniri", amount: "100 g", stockUnit: "Lor Peyniri", stockDeductionAmount: 100 },
          { name: "Elma", amount: "1 adet", stockUnit: "Elma", stockDeductionAmount: 1 }
        ],
        protein: 15,
        calories: 220,
        completed: false
      },
      {
        name: "Akşam",
        description: "200g tavuk + 250g makarna + söğüş sebze",
        ingredients: [
          { name: "Tavuk göğsü", amount: "200 g", stockUnit: "Tavuk", stockDeductionAmount: 200 },
          { name: "Makarna", amount: "250 g (pişmiş)", stockUnit: "Makarna", stockDeductionAmount: 100 }
        ],
        protein: 48,
        calories: 820,
        completed: false
      },
      {
        name: "Gece",
        description: "300ml süt + 40g yulaf",
        ingredients: [
          { name: "Süt", amount: "300 ml", stockUnit: "Süt", stockDeductionAmount: 300 },
          { name: "Yulaf ezmesi", amount: "40 g", stockUnit: "Yulaf", stockDeductionAmount: 40 }
        ],
        protein: 16,
        calories: 350,
        completed: false
      }
    ],
    totalCalories: 3400,
    totalProtein: 187
  },
  {
    id: "bakliyatli",
    name: "Bakliyat + Yumurta Menü",
    meals: [
      {
        name: "Kahvaltı",
        description: "4 yumurta + 50g yulaf + 200ml süt",
        ingredients: [
          { name: "Yumurta", amount: "4 adet", stockUnit: "Yumurta", stockDeductionAmount: 4 },
          { name: "Yulaf ezmesi", amount: "50 g", stockUnit: "Yulaf", stockDeductionAmount: 50 },
          { name: "Süt", amount: "200 ml", stockUnit: "Süt", stockDeductionAmount: 200 }
        ],
        protein: 32,
        calories: 620,
        completed: false
      },
      {
        name: "Kuşluk",
        description: "200g yoğurt + 1 muz",
        ingredients: [
          { name: "Yoğurt", amount: "200 g", stockUnit: "Yoğurt", stockDeductionAmount: 200 },
          { name: "Muz", amount: "1 adet", stockUnit: "Muz", stockDeductionAmount: 1 }
        ],
        protein: 10,
        calories: 250,
        completed: false
      },
      {
        name: "Öğle",
        description: "200g kıyma + 200g pirinç",
        ingredients: [
          { name: "Dana kıyma", amount: "200 g", stockUnit: "Kıyma", stockDeductionAmount: 200 },
          { name: "Pirinç", amount: "200 g", stockUnit: "Pirinç", stockDeductionAmount: 80 }
        ],
        protein: 48,
        calories: 800,
        completed: false
      },
      {
        name: "İkindi",
        description: "3 yumurta haşlama",
        ingredients: [
          { name: "Yumurta", amount: "3 adet", stockUnit: "Yumurta", stockDeductionAmount: 3 }
        ],
        protein: 18,
        calories: 240,
        completed: false
      },
      {
        name: "Akşam",
        description: "300g mercimek çorbası + 200g makarna + 100g lor peyniri",
        ingredients: [
          { name: "Kuru mercimek", amount: "100 g (kuru)", stockUnit: "Mercimek", stockDeductionAmount: 100 },
          { name: "Makarna", amount: "200 g", stockUnit: "Makarna", stockDeductionAmount: 80 },
          { name: "Lor peyniri", amount: "100 g", stockUnit: "Lor Peyniri", stockDeductionAmount: 100 }
        ],
        protein: 40,
        calories: 840,
        completed: false
      },
      {
        name: "Gece",
        description: "300ml süt + 30g fıstık ezmesi",
        ingredients: [
          { name: "Süt", amount: "300 ml", stockUnit: "Süt", stockDeductionAmount: 300 },
          { name: "Fıstık ezmesi", amount: "30 g", stockUnit: "Fıstık Ezmesi", stockDeductionAmount: 30 }
        ],
        protein: 18,
        calories: 350,
        completed: false
      }
    ],
    totalCalories: 3100,
    totalProtein: 166
  },
  {
    id: "ton_balikli",
    name: "Ton Balıklı Menü",
    meals: [
      {
        name: "Kahvaltı",
        description: "4 yumurta + 80g yulaf + 200ml süt + 1 muz",
        ingredients: [
          { name: "Yumurta", amount: "4 adet", stockUnit: "Yumurta", stockDeductionAmount: 4 },
          { name: "Yulaf ezmesi", amount: "80 g", stockUnit: "Yulaf", stockDeductionAmount: 80 },
          { name: "Süt", amount: "200 ml", stockUnit: "Süt", stockDeductionAmount: 200 },
          { name: "Muz", amount: "1 adet", stockUnit: "Muz", stockDeductionAmount: 1 }
        ],
        protein: 38,
        calories: 780,
        completed: false
      },
      {
        name: "Kuşluk",
        description: "200g yoğurt + 30g fıstık ezmesi + 1 elma",
        ingredients: [
          { name: "Yoğurt", amount: "200 g", stockUnit: "Yoğurt", stockDeductionAmount: 200 },
          { name: "Fıstık ezmesi", amount: "30 g", stockUnit: "Fıstık Ezmesi", stockDeductionAmount: 30 },
          { name: "Elma", amount: "1 adet", stockUnit: "Elma", stockDeductionAmount: 1 }
        ],
        protein: 18,
        calories: 300,
        completed: false
      },
      {
        name: "Öğle",
        description: "1 kutu ton balığı + 250g makarna + zeytinyağı",
        ingredients: [
          { name: "Ton balığı konserve", amount: "1 kutu (160g)", stockUnit: "Ton Balığı", stockDeductionAmount: 1 },
          { name: "Makarna", amount: "250 g", stockUnit: "Makarna", stockDeductionAmount: 100 }
        ],
        protein: 58,
        calories: 890,
        completed: false
      },
      {
        name: "İkindi",
        description: "3 yumurta haşlama + 1 dilim (50g) lor",
        ingredients: [
          { name: "Yumurta", amount: "3 adet", stockUnit: "Yumurta", stockDeductionAmount: 3 },
          { name: "Lor peyniri", amount: "50 g", stockUnit: "Lor Peyniri", stockDeductionAmount: 50 }
        ],
        protein: 24,
        calories: 290,
        completed: false
      },
      {
        name: "Akşam",
        description: "200g tavuk + 250g patates haşlama/fırın",
        ingredients: [
          { name: "Tavuk göğsü", amount: "200 g", stockUnit: "Tavuk", stockDeductionAmount: 200 },
          { name: "Patates/Soğan", amount: "250 g", stockUnit: "Patates", stockDeductionAmount: 250 }
        ],
        protein: 46,
        calories: 650,
        completed: false
      },
      {
        name: "Gece",
        description: "300ml süt",
        ingredients: [
          { name: "Süt", amount: "300 ml", stockUnit: "Süt", stockDeductionAmount: 300 }
        ],
        protein: 9,
        calories: 140,
        completed: false
      }
    ],
    totalCalories: 3050,
    totalProtein: 193
  }
];

export const INITIAL_SHOPPING_LIST: ShoppingItem[] = [
  {
    id: "shop_tavuk",
    name: "Bütün tavuk",
    market: "A101",
    quantity: "2 kg",
    price: 159,
    protein: 360,
    purchased: false,
    notes: "A101'de kilosu 79.50 TL",
    stockItemName: "Tavuk",
    stockAmountToAdd: 2000 // in grams
  },
  {
    id: "shop_yumurta",
    name: "Yumurta 30'lu",
    market: "BİM",
    quantity: "1 koli",
    price: 130,
    protein: 180,
    purchased: false,
    notes: "BİM/A101 fiyatı ~130 TL",
    stockItemName: "Yumurta",
    stockAmountToAdd: 30
  },
  {
    id: "shop_lor",
    name: "Lor peyniri",
    market: "BİM",
    quantity: "1 kg",
    price: 50,
    protein: 120,
    purchased: false,
    notes: "Börek lor veya yağsız lor",
    stockItemName: "Lor Peyniri",
    stockAmountToAdd: 1000 // in grams
  },
  {
    id: "shop_yogurt",
    name: "Yoğurt 3 kg",
    market: "A101",
    quantity: "1 adet",
    price: 70,
    protein: 140,
    purchased: false,
    notes: "Birşah 3kg 69.50 TL",
    stockItemName: "Yoğurt",
    stockAmountToAdd: 3000 // in grams
  },
  {
    id: "shop_sut",
    name: "Süt tam yağlı 1L",
    market: "ŞOK",
    quantity: "3 adet",
    price: 116,
    protein: 144,
    purchased: false,
    notes: "Mis tam yağlı (38.50 TL/L)",
    stockItemName: "Süt",
    stockAmountToAdd: 3000 // in ml
  },
  {
    id: "shop_yulaf",
    name: "Yulaf ezmesi 500 g",
    market: "BİM/ŞOK",
    quantity: "1 adet",
    price: 75,
    protein: 65,
    purchased: false,
    notes: "En ucuz ŞOK/BİM'de ~75 TL",
    stockItemName: "Yulaf",
    stockAmountToAdd: 500 // in grams
  },
  {
    id: "shop_makarna",
    name: "Makarna 500 g",
    market: "BİM",
    quantity: "2 adet",
    price: 79,
    protein: 48,
    purchased: false,
    notes: "Barilla (39.50 TL)",
    stockItemName: "Makarna",
    stockAmountToAdd: 1000 // in grams
  },
  {
    id: "shop_pirinc",
    name: "Pirinç (baldo)",
    market: "BİM",
    quantity: "1 kg",
    price: 74,
    protein: 28,
    purchased: false,
    notes: "Efsane 5kg baldo pirinç",
    stockItemName: "Pirinç",
    stockAmountToAdd: 1000 // in grams
  },
  {
    id: "shop_mercimek",
    name: "Kuru mercimek",
    market: "ŞOK",
    quantity: "500 g",
    price: 35,
    protein: 58,
    purchased: false,
    notes: "ŞOK/BİM fiyatı ~35 TL",
    stockItemName: "Mercimek",
    stockAmountToAdd: 500 // in grams
  },
  {
    id: "shop_fistik",
    name: "Fıstık ezmesi",
    market: "BİM",
    quantity: "1 kutu",
    price: 179,
    protein: 100,
    purchased: false,
    notes: "Wefood 300g 179 TL",
    stockItemName: "Fıstık Ezmesi",
    stockAmountToAdd: 300 // in grams
  },
  {
    id: "shop_muz",
    name: "Muz",
    market: "A101",
    quantity: "1 kg",
    price: 45,
    protein: 0,
    purchased: false,
    notes: "~45 TL/kg",
    stockItemName: "Muz",
    stockAmountToAdd: 5 // count approx
  },
  {
    id: "shop_elma",
    name: "Elma",
    market: "Manav",
    quantity: "1 kg",
    price: 30,
    protein: 0,
    purchased: false,
    notes: "A101/Manav ~30 TL/kg",
    stockItemName: "Elma",
    stockAmountToAdd: 5 // count approx
  },
  {
    id: "shop_patates",
    name: "Patates/Soğan",
    market: "A101",
    quantity: "2 kg",
    price: 30,
    protein: 0,
    purchased: false,
    notes: "Fırında haşlama için",
    stockItemName: "Patates",
    stockAmountToAdd: 2000 // in grams
  },
  {
    id: "shop_ton",
    name: "Ton balığı konserve",
    market: "BİM",
    quantity: "2 kutu",
    price: 110,
    protein: 100,
    purchased: false,
    notes: "2x80g paket",
    stockItemName: "Ton Balığı",
    stockAmountToAdd: 2 // count
  }
];

export const INITIAL_STOCK: Record<string, StockItem> = {
  "Yumurta": { name: "Yumurta", quantity: 6, unit: "adet", minAlertThreshold: 10 },
  "Tavuk": { name: "Tavuk", quantity: 400, unit: "g", minAlertThreshold: 500 },
  "Lor Peyniri": { name: "Lor Peyniri", quantity: 200, unit: "g", minAlertThreshold: 300 },
  "Yoğurt": { name: "Yoğurt", quantity: 300, unit: "g", minAlertThreshold: 600 },
  "Süt": { name: "Süt", quantity: 400, unit: "ml", minAlertThreshold: 1000 },
  "Yulaf": { name: "Yulaf", quantity: 120, unit: "g", minAlertThreshold: 200 },
  "Makarna": { name: "Makarna", quantity: 200, unit: "g", minAlertThreshold: 400 },
  "Pirinç": { name: "Pirinç", quantity: 150, unit: "g", minAlertThreshold: 300 },
  "Mercimek": { name: "Mercimek", quantity: 100, unit: "g", minAlertThreshold: 250 },
  "Fıstık Ezmesi": { name: "Fıstık Ezmesi", quantity: 50, unit: "g", minAlertThreshold: 100 },
  "Muz": { name: "Muz", quantity: 1, unit: "adet", minAlertThreshold: 2 },
  "Elma": { name: "Elma", quantity: 1, unit: "adet", minAlertThreshold: 2 },
  "Patates": { name: "Patates", quantity: 500, unit: "g", minAlertThreshold: 600 },
  "Ton Balığı": { name: "Ton Balığı", quantity: 1, unit: "kutu", minAlertThreshold: 2 },
  "Kıyma": { name: "Kıyma", quantity: 0, unit: "g", minAlertThreshold: 400 }
};

export const WEEKLY_BUDGET_LIMIT = 2100; // 300 TL * 7 days
