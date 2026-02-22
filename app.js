  
  const TELEGRAM_TOKEN = "8137282183:AAEldZgm7SGWp4fGDDejZBJZ_hFidtmueVo"; 
  const CHAT_ID = "7050310480";

  let favorites = [];
  let cart = [];
  let currentLang = 'uz';
  let isOrderStep = false;
  let selectedDetail = { id: null, qty: 1 };
  let currentUser = JSON.parse(localStorage.getItem('m_user')) || null;
let gameAutosaveInterval = null;

// Per-account game persistence helpers
function getGameStorageKey() {
  if (!currentUser || !currentUser.phone) return null;
  return `m_game_${currentUser.phone}`;
}

function saveGameStateForUser() {
  const key = getGameStorageKey();
  if (!key) return;
  try {
    const state = { coins: gameCoins, power: gamePower, level: gameLevel, clicks: gameClicks, favorites, cart };
    // include optional complex gameState if present
    if (typeof window !== 'undefined' && typeof gameState !== 'undefined') state.gameState = gameState;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) { console.error('saveGameState err', e); }
}

function loadGameStateForUser() {
  const key = getGameStorageKey();
  if (!key) return;
  try {
    const s = JSON.parse(localStorage.getItem(key) || 'null');
    if (s) {
      gameCoins = typeof s.coins === 'number' ? s.coins : gameCoins;
      gamePower = typeof s.power === 'number' ? s.power : gamePower;
      gameLevel = typeof s.level === 'number' ? s.level : gameLevel;
      gameClicks = typeof s.clicks === 'number' ? s.clicks : gameClicks;
      if (Array.isArray(s.favorites)) favorites = s.favorites;
      if (Array.isArray(s.cart)) cart = s.cart;
      // restore complex gameState if available
      if (s.gameState) {
        try {
          gameState = Object.assign({}, gameState || {}, s.gameState);
        } catch (e) { console.error('restore gameState err', e); }
      }
    }
  } catch (e) { console.error('loadGameState err', e); }
}


  // Fikr yuborish funksiyasi
  async function sendFeedback() {
    const feedback = document.getElementById('userFeedback').value.trim();
    if (!feedback) return alert("Iltimos, fikringizni yozing!");
    if (!currentUser) return document.getElementById('loginModal').classList.remove('hidden');

    const msg = `💬 **YANGI FIKR**\n\n👤 **Kimdan:** ${currentUser.name}\n📞 **Tel:** ${currentUser.phone}\n\n📝 **Xabar:** ${feedback}`;
    await sendToBot(msg);
    document.getElementById('userFeedback').value = '';
    alert("Fikringiz uchun rahmat!");
  }

  
const translations = {
  uz: {
    logo: "Maktab Market",
    katalog: "Katalog",
    search: "Qidirish...",
    orders: "Buyurtmalar",
    favorites: "Sevimlilar",
    cartTitle: "Savat",
    toCart: "Savatga",
    details: "Batafsil",
    total: "Jami",
    order: "Buyurtma berish",
    register: "Rasmiylashtirish",

    all: "Hammasi",
    sumka: "Sumkalar",
    daftarlar: "Daftarlar",
    ruchkalar: "Ruchkalar",
    kiyimlar: "Kiyimlar",
    elektronika: "Elektronika",
    atrlar: "Atirlar",
    poverbank: "Power Bank",
    palka: "Ko'rsatkich",
    books: "Kitoblar",

    added: "qo'shildi!",
    success: "Buyurtma yuborildi!",
    favEmpty: "Sevimlilar bo'sh",
    cartEmpty: "Savat bo'sh",
    ordersEmpty: "Hozircha buyurtma yo'q",
    promoTitle: "Promo / E'lon",
    promoContent: "Xush kelibsiz! Maxsus takliflar va e'lonlar shu yerda ko'rsatiladi.",
    ad1_text: "Maxsus Taklif: 20% chegirma!",
    ad1_sub: "Bugun faqat onlayn — chegirmalarni o'tkazib yubormang",
    ad2_text: "Yangi kolleksiya: Maktab uchun yangi to'plam",
    ad2_sub: "Sifatli va arzon — hozir xarid qiling",
    ad3_text: "Ramazon oyingiz muborak bo'lsin!",
    ad3_sub: "Sog'lik, baraka va tinchlik tilaymiz",
    detailQtyLabel: "Miqdor",
    detailTotalLabel: "Jami summa",
    category: "Kategoriya",
    price: "Narxi",
    description: "Tavsifi",
    deleteFromCart: "Olib tashlash",
    deleteFromFav: "O'chirib yuborish",
    confirm: "Tasdiqlash",
    cancel: "Bekor qilish"
  },

  ru: {
    logo: "Школьный Маркет",
    katalog: "Каталог",
    search: "Поиск...",
    orders: "Заказы",
    favorites: "Избранное",
    cartTitle: "Корзина",
    toCart: "В корзину",
    details: "Подробнее",
    total: "Итого",
    order: "Заказать",
    register: "Оформить заказ",

    all: "Все",
    sumka: "Сумки",
    daftarlar: "Блокноты",
    ruchkalar: "Ручки",
    kiyimlar: "Одежда",
    elektronika: "Электроника",
    atrlar: "Ароматы",
    poverbank: "Повербанк",
    palka: "Указка",
    books: "Книги",

    added: "добавлено!",
    success: "Заказ оформлен!",
    favEmpty: "Избранное пусто",
    cartEmpty: "Корзина пуста",
    ordersEmpty: "Пока нет заказов",
    promoTitle: "Промо / Объявление",
    promoContent: "Добро пожаловать! Специальные предложения и объявления отображаются здесь.",
    ad1_text: "Специальное предложение: скидка 20%!",
    ad1_sub: "Только сегодня онлайн — не пропустите скидки",
    ad2_text: "Новая коллекция: школьная линейка",
    ad2_sub: "Качественно и недорого — покупайте сейчас",
    ad3_text: "С Рамаданом!",
    ad3_sub: "Желаем здоровья, благословения и мира",
    detailQtyLabel: "Количество",
    detailTotalLabel: "Итоговая сумма",
    category: "Категория",
    price: "Цена",
    description: "Описание",
    deleteFromCart: "Удалить",
    deleteFromFav: "Удалить",
    confirm: "Подтвердить",
    cancel: "Отмена"
  }
};


const products = [
  //sumka
  { name: "Сумка барсетка LACOSTE", name_uz: "Сумка барсетка LACOSTE", name_ru: "Кошелек-барсетка LACOSTE", img: "https://avatars.mds.yandex.net/get-mpic/16567947/2a00000198a035af72b048eea8cd4d25a4a6/optimize", category: "sumka", price: 104000, description: "" },
  { name: "Ryukzak noutbuk uchun, sayohat, maktab, ish uchun, USB portli va suv o'tkazmaydigan, sport uchun", img: "https://avatars.mds.yandex.net/get-mpic/15431543/2a0000019b40737f23e3b76f9f9b98a588f6/optimize", category: "sumka", price: 171000, description: "" },
  { name: "Jordan 23 sport ryukzagi, qora, maktab va mashg‘ulotlar uchun", img: "https://avatars.mds.yandex.net/get-mpic/15431543/2a0000019b404871130e2b60cfc753df2975/900x1200", category: "sumka", price: 155000, description: "" },
  { name: "Sport sayohat sumkasi katta va fitness ryukzaki", img: "	https://avatars.mds.yandex.net/get-mpic/13480750/2a00000195b1f9d0b02a13c2f690c31c6253/optimize", category: "sumka", price: 114000, description: "" },
  { name: "Sayohat sumkasi, mato, katta o'lchamli, ko'p qirrali, transformator sumkasi", img: "https://avatars.mds.yandex.net/get-mpic/16464876/2a0000019ba4434cd959dbe930a8933a7544/120x160", category: "sumka", price: 113000, description: "" },
  { name: "EKO-kojadan zamonaviy sumka", img: "https://avatars.mds.yandex.net/get-mpic/16582226/2a0000019b241b95ef96b20d413c1709ef0d/optimize", category: "sumka", price:132000, description: "" },
  { name: "Sumka messenger erkaklar uchun, yelka orqali, kundalik, telefon uchun, shahar, zamonaviy uslubda", img: "https://avatars.mds.yandex.net/get-mpic/11465226/2a0000019ae840b5319f1bd1b9529ebee98d/optimize", category: "sumka", price: 85000, description: "" },
  { name: "Ayollar sumkasi, kichik elkama-sumka, telefon sumkasi, kross body, klath", img: "https://avatars.mds.yandex.net/get-mpic/15462703/2a000001973fd67563b4a27e27ddc3e3bed0/optimize", category: "sumka", price: 85000, description: "" },
  { name: "Qulay yelkaga tashlanadigan sumkalar — rukzakdek qulay, stilga ega !", img: "https://avatars.mds.yandex.net/get-mpic/16699368/2a0000019a266f7be15898e3815ac659b5d6/optimize", category: "sumka", price: 50000, description: "" },
  { name: "Qizlar uchun sumkalar, yelka orqali", img: "https://avatars.mds.yandex.net/get-mpic/16488168/2a000001993f60a5a6ee08ef2ac9f04d67ac/optimize", category: "sumka", price: 65000, description: "" },
 
 //kitoblar
  { name: "Stiv Jobs, Uolter Ayzekson, Asaxiy books nashriyoti tomonidan chiqarilgan kitob", name_uz: "Stiv Jobs, Uolter Ayzekson, Asaxiy books nashriyoti tomonidan chiqarilgan kitob", name_ru: "Стив Джобс, Уолтер Айзексон, издател Asaxiy books", img: "https://avatars.mds.yandex.net/get-mpic/5239537/2a00000197dfdf030e9a7db89b51d5cc0c73/optimize", category: "kitoblar", price: 135800, description: "." },
  { name: "Men – Fatih Duman Vaziyatlarga qarshi borgan insonning hikoyasi", name_uz: "Men – Fatih Duman Vaziyatlarga qarshi borgan insonning hikoyasi", name_ru: "Я — Фатих Думан. История человека, который боролся с困境", img: "https://avatars.mds.yandex.net/get-mpic/16289161/2a00000199c9ed095a76c7533dbbb4a8bd06/optimize", category: "kitoblar", price: 35000, description: "" },
  { name: "Kitob, Odam bo‘lish qiyin", img: "https://avatars.mds.yandex.net/get-mpic/12369201/2a0000019a067d54591b2f8a9c2f9f5e00c4/optimize", category: "kitoblar", price: 25000, description: "" },
  { name: "Sohangizda 1-raqam(li) bo‘lishni istaysizmi, Igor Mann", img: "https://avatars.mds.yandex.net/get-mpic/16289161/2a0000019b5f3f56551cdca8e018a200e2c9/optimize", category: "kitoblar", price: 60000, description: "" },
  { name: "Vi ne znayete JS. Asinxronnaya obrabotka i optimizatsiya. Kayl Simpson", img: "https://avatars.mds.yandex.net/get-mpic/12217350/2a00000199c4db4b572e982451cd0fdffa83/optimize", category: "kitoblar", price: 90000, description: "" },
  { name: "ELS English Language Studies: English Through Reading", img: "https://avatars.mds.yandex.net/get-mpic/14331402/2a0000019948c1fab33de2876f4ade99ba64/optimize", category: "kitoblar", price: 24000, description: "" },
  { name: "48 Zakonov vlasti", img: "https://avatars.mds.yandex.net/get-mpic/10231887/2a000001969af07ba32fbf8654f5887180ab/optimize", category: "kitoblar", price: 40000, description: "" },
  { name: "Kitob Pul psixologiyasi Morgan Xauzel", img: "https://avatars.mds.yandex.net/get-mpic/15462703/2a0000019754e42a55b236b3335e3a1e3f60/optimize", category: "kitoblar", price: 72900, description: "" },
  { name: "Takiye raznyye miry", img: "https://avatars.mds.yandex.net/get-mpic/6065438/2a00000195c6e37b2354d6815990f4fecdc7/optimize", category: "kitoblar", price: 26900, description: "" },   
  { name: "4000 essential english words 1, Uzbek translations", img: "https://avatars.mds.yandex.net/get-mpic/4076910/2a0000019b5a865aeda272aa7e90eba60475/optimize", category: "kitoblar", price: 17000, description: "." },   
  { name: "Kitob Muqaddima Ibn Xaldun, tarix va sotsiologiyaga kirish.", img: "https://avatars.mds.yandex.net/get-mpic/13964805/2a00000198182f28929f572ed4eeb4bb9160/optimize", category: "kitoblar", price: 60000, description: "" },   
  { name: "4000 essential english words 3, Uzbek translations", img: "https://avatars.mds.yandex.net/get-mpic/17657724/2a0000019b5a96ee7048ddc1e8b39dcdcfa7/optimize", category: "kitoblar", price: 17000, description: "." },   
  { name: "4000 essential english words 3, Uzbek translations", img: "https://avatars.mds.yandex.net/get-mpic/16164715/2a0000019b210d32cc88a93a964ad857eeb9/optimize", category: "kitoblar", price: 17900, description: "" },   
  { name: "Tarix milliy sertifikat A+", img: "https://avatars.mds.yandex.net/get-mpic/17873630/2a00000199e7707ea66d0d4fba28eef155b8/optimize", category: "kitoblar", price: 50000, description: "" },   
  { name: "Essential Grammar in Use , Raymond Murphy, A4 format, 262 bet , yumshoq muqova", img: "https://avatars.mds.yandex.net/get-mpic/15284069/2a0000019a0fcf0b0feb68bad5a1f0702ce3/optimize", category: "kitoblar", price: 30500, description: "" },   
  { name: "Agata Kristi - Ubiystvo v Vostochnom Ekspresse", img: "https://avatars.mds.yandex.net/get-mpic/16289161/2a0000019773f5cc78e4cb1e4e401fd8ea65/optimize", category: "kitoblar", price: 32900, description: "" },   
  { name: "Duo taqdirni o‘zgartiradi-hayotni o‘zgartiruvchi va qalbga osoyishtalik bag‘ishlovchi duo kuchi haqida kitob.", img: "https://avatars.mds.yandex.net/get-mpic/15199813/2a0000019a6db9e488fcbd99dbe00356aa9e/optimize", category: "kitoblar", price: 41500, description: "" },   
 //DAFTARLAR
  { name: "“Kosmik So‘ya” bloknoti — zamonaviy A6 formatdagi qora varaqali ijodiy daftar", img: "https://avatars.mds.yandex.net/get-mpic/12456181/2a0000019a3a90c1b18709d2c371af70415e/optimize", category: "daftarlar", price: 19000, description: "" },
  { name: "Muslim bloknotlar, yangi va jozibali ko`rinish, muslima qizlar uchun ajoyib yangilik. Yalong", img: "https://avatars.mds.yandex.net/get-mpic/10327572/2a00000198135b8eb951ac790ba61890c94e/optimize", category: "daftarlar", price: 27000, description: "" },
 { name: "“A Cat Named Sunny” bloknoti • ixcham A6 format • kundalik yozuvlar, o‘qish va ijod uchun 80 varaq katakli", img: "https://avatars.mds.yandex.net/get-mpic/1923922/2a0000019a9e24beb8961bd70d55f15968da/optimize", category: "daftarlar", price: 24000, description: "" },
  { name: "Daftar 36 varaqli, A5 formatda, 5 dona maktab va uyda foydalanish uchun qulay, sifatli qog‘oz va mustahkam muqovaga ega.", img: "https://avatars.mds.yandex.net/get-mpic/18207042/2a0000019b6e11b65efc42ccb05d44aed73e/optimize", category: "daftarlar", price: 26000, description: "" },
  { name: "Tabiatni hush ko`radiganlar uchun. Yo`l - yo`l varoqli 4 bo`limga bo`lingan.", img: "https://avatars.mds.yandex.net/get-mpic/4114383/2a0000019b67bb64f78c9d513b8c30d571af/optimize", category: "daftarlar", price: 28000, description: " " },
 { name: "Xijob bloknotlar, yangi va jozibali ko`rinish, muslima qizlar uchun ajoyib yangilik. 52 varoq", img: "https://avatars.mds.yandex.net/get-mpic/18149576/2a0000019bccc6af15ebebbe039183e319d8/optimize", category: "daftarlar", price: 24000, description: "" },
  //ruchkalar
  { name: "Ruchka, do'stlar va yaqinlar uchun hazil uchun", name_uz: "Ruchka, do'stlar va yaqinlar uchun hazil uchun", name_ru: "Ручка, смешная для друзей и близких", img: "https://avatars.mds.yandex.net/get-mpic/4343092/2a0000019a967b4b43b9faef6d9f119a84b2/optimize", category: "ruchkalar", price: 20000, description: "" },
  { name: "Gelli ruchka. Pos 0,5 mm 3 dona qora rang", name_uz: "Gelli ruchka. Pos 0,5 mm 3 dona qora rang", name_ru: "Гелевая ручка. 0,5 мм 3 штуки черного цвета", img: "https://avatars.mds.yandex.net/get-mpic/13714821/2a000001983d95b364762a8d6c7a54f149c5/optimize", category: "ruchkalar", price: 15000, description: "" },
  { name: "Maktab uchun sharikli ruchkalar to‘plami – 12 dona", img: "https://avatars.mds.yandex.net/get-mpic/6374009/2a0000019985844c965025305ddb22779d7c/optimize", category: "ruchkalar", price:23000, description: "" },
  { name: "Gelli ruchkalar Ya Ting G-905, siyohrang, qalinligi 0,5 mm, 6 dona", img: "https://avatars.mds.yandex.net/get-mpic/17016301/2a0000019a6a2947c13aa83d3d432d83971c/optimize", category: "ruchkalar", price: 20000, description: "" },
  { name: "Ruchka-lazer, taqdimotlar uchun ko'rsatgich, chiroq, magnit", img: "https://avatars.mds.yandex.net/get-mpic/14886053/2a0000019bdcd3eb2e734c6bc053d3993f3a/optimize", category: "ruchkalar", price: 340000, description: "" },
  { name: "Ruchka Siyah 777 NEON 1.0 mm, 50 dona", img: "https://avatars.mds.yandex.net/get-mpic/15174538/2a00000198fe2c93226ba4ddbc7797259403/optimize", category: "ruchkalar", price: 45000, description: "" },      
   { name: "Gelli ruchka. Pos 0,5 mm 12 dona ko'k rang", img: "https://avatars.mds.yandex.net/get-mpic/15265136/2a000001985757198d0a9722fad4b3643432/optimize", category: "ruchkalar", price: 38900, description: "" },
  { name: "Rangli geleviy ruchkalar 4 dona", img: "https://avatars.mds.yandex.net/get-mpic/15246975/2a00000198acec93ba106c019102d40dbb40/optimize", category: "ruchkalar", price: 20000, description: " " },
  
  //kiyimla
   { name: "Maktab yoshdagı bolalar uchun sport kostyumi DNZ, molnyali ", name_uz: "Maktab yoshdagı bolalar uchun sport kostyumi DNZ, molnyali ", name_ru: "Спортивный костюм DNZ для школьников с молнией", img: "https://avatars.mds.yandex.net/get-mpic/13526260/2a00000198b1e2f3f2fdedf25ccefc8e4f1e/optimize", category: "kiyimlar", price: 185000, description: "tepa va past 122 dan 164 gacha bor" },
  { name: "Maktab yoshdagı bolalar uchun chiziqli sport kostyumi ZERO-LIMITED", name_uz: "Maktab yoshdagı bolalar uchun chiziqli sport kostyumi ZERO-LIMITED", name_ru: "Полосатый спортивный костюм ZERO-LIMITED для школьников", img: "https://avatars.mds.yandex.net/get-mpic/16857451/2a00000198e6ea11e2210b65f328a5d36481/optimize", category: "kiyimlar", price: 192000, description: "" },
   { name: "Bolalar futbolkasi Status kids qora rangli, o‘g‘il va qiz bollar uchun 10-11 yoshga.", img: "https://avatars.mds.yandex.net/get-mpic/15332119/2a00000196e76fbba49aa7042017842b29b5/optimize", category: "kiyimlar", price: 53000, description: "10-11  140-146 13-13 152-158" },
  { name: "Kundalik va maktab ko'rinishi uchun bluzka va galstuk, yon bo'yinli qora sarafan ko'ylak", img: "https://avatars.mds.yandex.net/get-mpic/14360956/2a0000019a7e1ad46df9f9316a62ac9a4950/optimize", category: "kiyimlar", price: 230000, description: "44-46 170-176" },
   { name: "Kostyum (dvoyka) qizlar uchun", img: "https://avatars.mds.yandex.net/get-mpic/14635071/2a0000019658c95968a3630713a7b9deb4e8/optimize", category: "kiyimlar", price: 91000, description: "6 yoshdan 9 yoshgacha botr" },
  { name: "Real Madrid futbol formasi 25-26, mavsum uchun haqiqiy sport sevuvchilar formasi", img: "https://avatars.mds.yandex.net/get-mpic/15380440/2a00000199443585bde729a0b216e6178578/optimize", category: "kiyimlar", price: 144000, description: "oq va qora ranglarda bor" },
   { name: "spartifka erkaklar uchun, dvoyka erkaklar. Erkaklar kiyimlari, Nasem, to‘q ko‘k rang, o‘lchami 54", img: "https://avatars.mds.yandex.net/get-mpic/6236983/2a0000019b222e5741a7e939de1262ca11f0/optimize", category: "kiyimlar", price: 104000, description: "" },
  { name: "spartifka erkaklar uchun, dvoyka erkaklar. Erkaklar kiyimlari, Nasem, kulrang, o‘lchami 56", img: "https://avatars.mds.yandex.net/get-mpic/15258748/2a000001990ed59ed22c569e17d31cae9a0d/optimize", category: "kiyimlar", price: 194000, description: "" },
   { name: "Erkaklar kiyimi to‘plami, erkaklar kiyimi, ikki kishilik kostyum, polo va shim, mavsumiy, bej rangi, XXXL Nasem o‘lchami", img: "https://avatars.mds.yandex.net/get-mpic/16166361/2a0000019b26da6f4de98bc9b995ab1d0aec/optimize", category: "kiyimlar", price: 114000, description: "" },
  { name: "Futbolka baza, 100% paxtadan unisex, 3 hil eng keraklai rangalar", img: "https://avatars.mds.yandex.net/get-mpic/17846399/2a00000199aef3facdf2b1c00580c66dde5a/optimize", category: "kiyimlar", price: 43462, description: "3 xil rangda mavjun qora oq va to'q ko'k razmerlar bor" },
   { name: "Ayollar uchun to'rli krossovkalar, bahor-yoz uchun", img: "https://avatars.mds.yandex.net/get-mpic/12639434/2a000001961afdfbd30a30b39291918050f1/optimize", category: "kiyimlar", price: 174000, description: "35 dan 39 razmergacha bor " },
  { name: "Qishgi sharf - erkaklar va ayollar uchun trenddagi qalin, yumshoq va issiq", img: "https://avatars.mds.yandex.net/get-mpic/5103899/2a0000019ad36bf8c5e847560cd821e2700b/optimize", category: "kiyimlar", price: 54000, description: "kengligi 30 uzunligi 180 kengligi 66 uzunligi 90" },
   { name: "Retro va Yangi uslubdagi Futbol formasi Klassik ruh, zamonaviy qulaylik bilan", img: "https://avatars.mds.yandex.net/get-mpic/15492377/2a0000019730278f7c71f06a7cf9f31a4f42/optimize", category: "kiyimlar", price: 114900, description: "ikki xil rangda mavjud razmerlari ham bor " },
  { name: "Retro va Yangi uslubdagi Futbol formasi Klassik ruh, zamonaviy qulaylik bilan", img: "https://avatars.mds.yandex.net/get-mpic/14373055/2a000001972fe76df8cfc411fc7d1a3fe962/optimize", category: "kiyimlar", price: 149000, description: "1 hil rang va razmerlari mavjud" },
  { name: "Erkaklar kiyimlari, dvoyka erkaklar, joggerlar va xudi, spartifka erkaklar uchun, BMW bosma naqshi tushirilgan, rangi qora, M o‘lchamli", img: "https://avatars.mds.yandex.net/get-mpic/5186016/2a0000019ae40ea85862d3f8b76b55f3b5a4/optimize", category: "kiyimlar", price: 175000, description: "2 hil rang va razmerlari mavjud" },
  {  name: "Erkaklar kiyimlari, dvoyka erkaklar, joggerlar va xudi, spartifka erkaklar uchun, BMW bosma naqshi tushirilgan, rangi qora, M o‘lchamli",  img: "https://avatars.mds.yandex.net/get-mpic/15050963/2a0000019ae40494a793ea349eed7599caa0/optimize", category: "kiyimlar", price: 175000, description: "1 hil rang va razmerlari mavjud" },
  { name: "Erkaklar kiyimi to‘plami, erkaklar kiyimi, ikkilik kostyum, polo va shim, mavsumiy, to‘q ko‘k rang, XXXL Nasem o‘lchami", img: "https://avatars.mds.yandex.net/get-mpic/16412103/2a0000019b0ccc2b863373ff1b8a32c595a4/optimize", category: "kiyimlar", price: 114000, description: "2 hil rang va razmerlari mavjud emas" },
  { name: "Erkaklar kiyimi to‘plami, erkaklar kiyimi, ikkilik kostyum, polo va shim, mavsumiy, jigarrang, XXXL Nasem o‘lchami", img: "https://avatars.mds.yandex.net/get-mpic/12394941/2a000001995d040cc99adf43e0a9dd81df41/optimize", category: "kiyimlar", price: 114000, description: "2 hil rang va razmerlari mavjud emas" },
  { name: "Erkaklar kiyimlari, vetrovka erkaklar uchuni, dvoykalar, kuzgi kiyimlar, Nasem, yarim mavsum, kulrang, XXXL o‘lcham", img: "https://avatars.mds.yandex.net/get-mpic/5233339/2a0000019b208c870d745c7078bd645ddbb0/optimize", category: "kiyimlar", price: 115000, description: "1 hil rang va razmerlari mavjud" },
  { name: "Erkaklar kiyimi to‘plami, erkaklar kiyimi, ikkilik kostyum, polo va shim, mavsumiy, jigarrang, XXXL Nasem o‘lchami", img: "https://avatars.mds.yandex.net/get-mpic/5219690/2a0000019b2c303f0cf77ddac7b967c5f3e5/optimize", category: "kiyimlar", price: 115000, description: "1 hil rang va razmerlari mavjud" },
  { name: "Erkaklar oversize sport komplekti, qora xudi va shim, paxta, qulay va zamonaviy", img: "https://avatars.mds.yandex.net/get-mpic/18475675/2a0000019bc7adbde479f0833c5850c212d0/optimize", category: "kiyimlar", price: 20000, description: "1 hil rang va razmerlari mavjud 50 52" },
  { name: "Ikkilik kostyum, erkaklar to‘plami, erkaklar kiyimlari, joggerlar va xudilar, qora rang, XL o‘lcham", img: "https://avatars.mds.yandex.net/get-mpic/18709130/2a0000019b6921b945a01a47d90087e3e851/optimize", category: "kiyimlar", price: 315000, description: "1 hil rang va razmerlari mavjud" },
  { name: "Erkaklar krossovkalari, sport uchun, nafas oladigan to'r", img: "https://avatars.mds.yandex.net/get-mpic/15257343/2a00000196254c08177182e64638af721926/optimize", category: "kiyimlar", price: 140000, description: "razmerlar mavjud" },
  { name: "Universal krossovkalar, yozgi, mato, olib tashlanadigan taglik, ip bilan bog'lash, uniseks", img: "https://avatars.mds.yandex.net/get-mpic/13714821/2a000001961b9e1e92f60ff50c702addbd36/optimize", category: "kiyimlar", price: 80000, description: "razmerlar 37 38" },
  { name: "Retro uslubidagi krossovkalar, erkaklar va ayollar uchun, klassik dizayn modeli, qulay va engil taglik", img: "https://avatars.mds.yandex.net/get-mpic/18252787/2a0000019a4a15de32dd2f170f0f72a6a25c/optimize", category: "kiyimlar", price: 80000, description: "razmer faqat 36 mavjud" },
  { name: "Ayollar uchun to'rli krossovkalar, bahor-yoz uchun", img: "https://avatars.mds.yandex.net/get-mpic/12639434/2a000001961afdfbd30a30b39291918050f1/optimize", category: "kiyimlar", price: 175000, description: "razmerlar 35 dan 29 gacha mavjud" },
  { name: "Ayollar balet kvartiralari, dumaloq burunli patentli poyabzal", img: "https://avatars.mds.yandex.net/get-mpic/12800328/2a000001971c6514c44784b6f68f03369c6b/optimize", category: "kiyimlar", price: 125000, description: "razmerlar 36 dan 41 gacha mavjud" },
  { name: "Yozgi nafas olishga mo'ljallangan tarmoq krossovkalari erkaklar va ayollar uchun , engil va qulay model", img: "https://avatars.mds.yandex.net/get-mpic/12525950/2a0000019617085a6183dd70b674a6da7f1f/optimize", category: "kiyimlar", price: 79000, description: "razmer 38" },
  { name: "Erkaklar krossovkalari, mavsumiy bo‘lmagan, kundalik poyabzallari, qulayligi va sifati, 41 o'lchami, oq", img: "https://avatars.mds.yandex.net/get-mpic/16413949/2a0000019b2c4b92146c01cf106ec55b27cf/optimize", category: "kiyimlar", price: 113000, description: "razmer 38 dan 40 gacha mavjud " },
  { name: "Erkaklar uchun eko-charm krossovkalar, koreys uslubi", img: "https://avatars.mds.yandex.net/get-mpic/5332815/2a00000195b7dd892c6bc409e30c9908f18b/optimize", category: "kiyimlar", price: 155000, description: "razmerlar41 dan 43 gacha mavjud" },
  { name: "Erkaklar kiyimlari, dvoyka erkaklar, joggerlar va xudi, spartifka erkaklar uchun, BMW bosma naqshi tushirilgan, rangi qora, M o‘lchamli", img: "https://avatars.mds.yandex.net/get-mpic/16111726/2a0000019b172a483765fa311d1f82d938f8/optimize", category: "Kiyimlar", price:115000, description: "razmerlar 38 dan 42 gacha mavjud" },
  { name: "Erkaklar uchun krossovkalar, shnursiz, nafas oluvchi, trikotaj matoli, yozgi.", img: "https://avatars.mds.yandex.net/get-mpic/11401175/2a00000196243e6201ac8f3053677f5da701/optimize", category: "kiyimlar", price: 79000, description: "razmerlar 39 40 mavjud " },
  { name: "Erkaklar uchun premium darajadagi mokasinlar", img: "https://avatars.mds.yandex.net/get-mpic/11395611/2a000001979d0d5e04652d24e22c27cd6b90/optimize", category: "kiyimlar", price:154000, description: "razmerlar 39 dan 44 gacha mavjud" },
  { name: "Erkaklar va ayollar uchun poyafzal, erkaklar uchun krossovkalar bahor-yoz, uniseks,", img: "https://avatars.mds.yandex.net/get-mpic/15285180/2a00000198e825bbcc5c39d720c2e954ab10/optimize", category: "kiyimlar", price: 84000, description: "razmer 36 va 38 mavjud " },
  { name: "Yozgi krossovkalar tarmoq matosidan, yengil va yumshoq — har kuni uchun qulaylik va stil.", img: "https://avatars.mds.yandex.net/get-mpic/13736117/2a000001961ba2b114cf240be5a82c1f35d0/optimize", category: "kiyimlar", price: 84000, description: "razmer 36 mavjud faqat " },
  { name: "Qora Nike krossovkalari | Yengil, zamonaviy, uniseks | O'lchamlar 40–45", img: "https://avatars.mds.yandex.net/get-mpic/4887838/2a000001960158b53de5ecdaae597d18da2e/optimize", category: "kiyimlar", price: 204000, description: "razmer 40mavjud" },
  { name: "Krossovkalar erkaklar uchun, keda, zamish va teri", img: "https://avatars.mds.yandex.net/get-mpic/5236119/2a00000199b7d5d654055cb0f118e1158c7a/optimize", category: "kiyimlar", price: 153000, description: "razmerlar 40 42 dna 44 gacha mavjud" },
  { name: "Erkaklar krossovkalari, sport va kundalik poyabzal, 43 o'lcham, qora", img: "https://avatars.mds.yandex.net/get-mpic/15585232/2a0000019b206f2f2ea7081e5ac7e8e3e59d/optimize", category: "kiyimlar", price: 115000, description: "razmer 38 dan 42 gacha mavjud " },
  { name: "Erkaklar to'rli krossovkalar, nafas oladigan yoz", img: "https://avatars.mds.yandex.net/get-mpic/12500095/2a00000197abcb408f82d6e0dcf4604ec064/optimize", category: "kiyimlar", price: 130000, description: "razmerlar 40 dan 43 gacha mavjud" },
  { name: "Erkaklar uchun Jordan kuzgi krossovkalari, sport va sayr uchun, Malomerka", img: "https://avatars.mds.yandex.net/get-mpic/12621455/2a0000019b788a237971147c998716aadfd2/optimize", category: "kiyimlar", price: 144000, description: "razmerlar 39 dan 43 gacha mavjud" },
  { name: "Ayollar poyafzallari, ayollar va qizlar uchun LIDER slip-ons, krossovkalar, Skechers, krossovkalar 37", img: "https://avatars.mds.yandex.net/get-mpic/14635071/2a000001973063b80d9de94eb67868696fbf/optimize", category: "kiyimlar", price: 94000, description: "razmerlar 36 dan 40 gacha mavjud" },
  { name: "Erkaklar va ayollar uchun uniseks krossovkalar, yoz-bahor-kuz-qish uchun, 35-37 o'lchamda", img: "https://avatars.mds.yandex.net/get-mpic/11442293/2a0000019971690240714ce52d9d4c677f26/optimize", category: "kiyimlar", price: 94000, description: "razmerlar 35 dan 37 gacha mavjud " },
//elektronika
  { name: "Aqlli soatlar Smart Watch 8 Big T800 Pro Max, Android va iPhone uchun, simsiz zaryadlash", img: "https://avatars.mds.yandex.net/get-mpic/14688430/2a000001966bc83ff49d95f0021259062db3/optimize", category: "elektronika", price: 53900, description: "tepa va past 122 dan 164 gacha bor" },
  { name: "Aqlli soat Smart-watch T800 Ultra, 49 mm/Aqilli soat Smartwatch ios android", img: "https://avatars.mds.yandex.net/get-mpic/12222014/2a000001964d4c29898f836792cc4a245986/optimize", category: "elektronika", price: 649000, description: "oq va qora ranglarda bor" },
  { name: "Smart Watch WATCH ME16: Bluetooth, Fitness Tracker, Bildirishnomalar, Qora", img: "https://avatars.mds.yandex.net/get-mpic/16479329/2a000001992ac679d708e3744cfe36c79b94/optimize", category: "elektronika", price: 101000, description: "10-11  140-146 13-13 152-158" },
  { name: "Aqlli soatlar T800 Pro MAX L, IOS, Android,", img: "https://avatars.mds.yandex.net/get-mpic/5391389/2a00000199894daa2919fb75b0fe1266a39a/optimize", category: "elektronika", price: 590000, description: "44-46 170-176" },
  { name: "Soat erkaklar uchun, arab raqamli soat, sovg'a qutisi bilan, arab soat, tug'ilgan kun", img: "https://avatars.mds.yandex.net/get-mpic/13736117/2a00000196ed24975db6cb494a0e9bfe0418/optimizeS", category: "elektronika", price: 54000, description: "6 yoshdan 9 yoshgacha botr" },
  { name: "Erkaklar Qo‘l Soati, Kvarst Mexanizm, Qora Siferblatli, Kumush Rangli Korpus – Klassik Dizayn, Har Kunlik Uchun Ideal", img: "https://avatars.mds.yandex.net/get-mpic/10483373/2a0000019bf4eaea05d1285afd7d4eb83aa1/optimize", category: "elektronika", price: 711000, description: "oq va qora ranglarda bor" },
  { name: "Erkaklar soati, UZB gerbi bilan, qora charm tasma bilan", img: "https://avatars.mds.yandex.net/get-mpic/14331733/2a00000199e27ec6350cf2d59345fc06e0a2/optimize", category: "elektronika", price: 550000, description: "6 xil rangda bor" },
  { name: "Arab soat, raqamli, mativiy, sovg'a qutisi bilan, tasma sozlagich, aura 999", img: "https://avatars.mds.yandex.net/get-mpic/5214322/2a0000019a9bb604a6cb5d8a068aa08934a2/optimize", category: "elektronika", price: 44000, description: "" },
  { name: "Erkaklar qo'l soati kvarts mexanizmli, klassik uslub eco charm kamar, sovga qadogida", img: "https://avatars.mds.yandex.net/get-mpic/11318716/2a0000019654e75cfdaaf07ea45e6ebafbac/optimize", category: "elektronika", price: 40900, description: "" },
  { name: "Ayollar uchun klassik uslubdagi soat va taqinchoqlar sovga soat, braslet, zirak, uzuk va taqinchoqlar to'plami", img: "https://avatars.mds.yandex.net/get-mpic/10393486/2a0000019946a2ed912fc269a8c7346513af/optimize", category: "elektronika", price: 70000, description: "" },
  { name: "Ayollar uchun klassik uslubdagi soat va taqinchoqlar sovga soat, braslet, zirak, uzuk va taqinchoqlar to'plami", img: "https://avatars.mds.yandex.net/get-mpic/16795237/2a00000199990fff2bcfc7f2fd054fd1a868/optimize", category: "elektronika", price: 70000, description: "" },
  { name: "Arabic Aura uslubidagi erkaklar qo‘l soati — qora korpusli, charm tasmali, kvarts mexanizmli, ajoyib soat siz haqingizda sizdan avval gapiradi !", img: "https://avatars.mds.yandex.net/get-mpic/14909198/2a00000199b3b515e7ce3fe3bba372024ae8/optimize", category: "elektronika", price: 64000, description: "" },
  { name: "Ayollar uchun zamonaviy qo‘l soatlari", img: "https://avatars.mds.yandex.net/get-mpic/12225658/2a00000197e846569a7b65e3ef225a829718/optimize", category: "elektronika", price: 54000, description: " " },
  { name: "Ayollar Rolex soati — nafislik va hashamat uyg‘unligi", img: "https://avatars.mds.yandex.net/get-mpic/13456581/2a0000019a1d26b5367635eba9164f7810f2/optimize", category: "elektronika", price: 44000, description: "" },
  { name: "Ayollar Rolex soati — nafislik va hashamat uyg‘unligi", img: "https://avatars.mds.yandex.net/get-mpic/16285991/2a0000019a1d26b3cd469ef5769392f0b092/optimize", category: "elektronika", price: 44000, description: "" },
  { name: "S10 Pro Max Smart Watch 7 in 1, HD ekran, sport, qo‘ng‘iroqli", img: "https://avatars.mds.yandex.net/get-mpic/3927509/2a000001999e92dbde980be0adbeb6c63468/optimize", category: "elektronika", price: 119000, description: "" },
//atirlar
  { name: "Erkaklar uchun atir L'immensite atir, erkaklar va ayollar uchun parfyumlangan suv, Louis Vuitton L'immensite, 5 ml", img: "https://avatars.mds.yandex.net/get-mpic/18088983/2a0000019be62017e815d0f939d9f24072bf/optimize", category: "atrlar", price: 13000, description: "" },
  { name: "Stronger With You atir, erkaklar va ayollar uchun atir, Stronger With You Giorgio Armani, atir erkaklar uchun 3 ML", img: "https://avatars.mds.yandex.net/get-mpic/16273139/2a00000198604452bfad0740b42b4aacb3f5/optimize ", category: "atrlar", price: 15000, description: "" },
  { name: "Erkaklar uchun parfyumlangan suv, erkaklar atiri Armani Stronger With You asosidagi quyma parfyumeriya , 3 ml 12 g", img: "https://avatars.mds.yandex.net/get-mpic/13532112/2a00000197313bfb42c02982d5e26e37403c/optimize ", category: "atrlar", price: 18000, description: "" },
  { name: "Parfyumlangan suv Now erkaklar erkaklae uchun now atir", img: "https://avatars.mds.yandex.net/get-mpic/3916156/2a0000019b1704ddec7fe728c851dee8296e/optimize ", category: "atrlar", price: 115000, description: "" },
  { name: "Atir Qaed Al Fursan Lattafa, erkaklar uchun parfyumlangan suvi, 100 ml", img: "https://avatars.mds.yandex.net/get-mpic/16423639/2a00000198b3e40e5450196651ccefbf9cbe/optimize", category: "atrlar", price: 25000, description: "" },

//poverbank
 { name: "Power bank tashqi akkumulyator Ekranli 12000mAh quvvat banki (LCD/LED)", img: "https://avatars.mds.yandex.net/get-mpic/5219059/2a0000019bd695ea3928605010a6e6a9fc94/optimize", category: "poverbank", price: 70000, description: "" },
//oq varoqla
 { name:"Printer va kseroks uchun A4 qog‘oz – 500 varaq – Sylvamo Svetocopy Premium, 146% CIE oq rang, zichligi 80 g/m² – Uy, o‘qish va ofis uchun", img: "https://avatars.mds.yandex.net/get-mpic/12641020/2a0000019619f24992ec597ffd0045d7e48e/optimize", category: "poverbank", price: 62000, description: "" },
 { name:"Qog'oz Smartist Paper, ofis uchun, A4, 500 varaq, 70 gr", img: "https://avatars.mds.yandex.net/get-mpic/12218575/2a00000197b6a7e8f9e2aea31bb852acfc2f/optimize", category: "poverbank", price: 52000, description: "" },

//palka
  { name: "Teleskopik ko'rsatkich barmoq uchi Pikmi tayoq, uzaytiriladigan barmoq ko'rsatkichi, o'qituvchi va blogger uchun tasodifiy ranglar", img: "https://avatars.mds.yandex.net/get-mpic/15311448/2a000001982bca35f6868e34fa0c92730b5b/optimize", category: "palka", price: 10000, description: "" },
  { name: "Teleskopik ko'rsatkich barmoq uchi Pikmi tayoq, uzaytiriladigan barmoq ko'rsatkichi, o'qituvchi va blogger uchun tasodifiy ranglar", img: "https://avatars.mds.yandex.net/get-mpic/15311448/2a000001982bca35f6868e34fa0c92730b5b/optimize", category: "palka", price: 10000, description: "" },

];

// Helper: return product name based on current language
function getProductName(prod) {
  if (!prod) return '';
  if (currentLang === 'ru') return prod.name_ru || prod.name || (prod.names && (prod.names.ru || prod.names.uz)) || '';
  return prod.name_uz || prod.name || (prod.names && (prod.names.uz || prod.names.ru)) || '';
}

function renderProducts(list = products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  list.forEach((p, index) => {
    const card = document.createElement("div");

    card.className =
      "product bg-gray-900 rounded-2xl p-4 border border-white/10 active-scale flex flex-col h-full relative";

    card.setAttribute("data-id", index);
    card.setAttribute("data-price", p.price);
    card.setAttribute("data-category", p.category);

    card.innerHTML = `
      <div class="relative">
        <img src="${p.img}" class="w-full h-32 object-cover rounded-xl mb-2">
        <button id="fav-btn-${index}" onclick="event.stopPropagation(); toggleFav(${index})" class="absolute top-2 right-2 bg-black/30 p-1.5 rounded-full">
          <span id="fav-icon-${index}" class="text-white">♡</span>
        </button>
      </div>

        <h4 class="product-name text-sm font-bold mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
          ${getProductName(p)}
        </h4>

      <p class="text-yellow-500 font-bold text-sm mb-2">
        ${p.price.toLocaleString()} so'm
      </p>

      <div class="flex gap-2 mt-auto">
        <button onclick="event.stopPropagation(); addToCart(${index})"
          class="flex-1 bg-yellow-500 text-black text-xs py-2 rounded-lg font-bold lang-toCart">
          ${translations[currentLang].toCart}
        </button>
      </div>
    `;

    grid.appendChild(card);
    // open detail modal when card clicked
    card.onclick = () => showDetails(index);
    // ensure heart reflects current favorites
    if (favorites.includes(index)) {
      const iconEl = document.getElementById(`fav-icon-${index}`);
      if (iconEl) iconEl.innerText = '❤';
    }
  });
}
// Render orders history
function renderOrders() {
  const promoEl = document.getElementById('ordersPromo');
  const list = document.getElementById('ordersList');
  if (!list) return;
  // when rendering orders normally, hide any promo content
  if (promoEl) promoEl.classList.add('hidden');
  list.classList.remove('hidden');
  const orders = JSON.parse(localStorage.getItem('m_orders') || '[]');
  if (orders.length === 0) {
    list.innerHTML = `<p class="text-center text-gray-500 py-8">${translations[currentLang].ordersEmpty}</p>`;
    return;
  }
  list.innerHTML = '';
  orders.forEach((o, idx) => {
    const dt = new Date(o.date).toLocaleString();
    let itemsHtml = '';
    o.items.forEach(it => {
      const itName = (currentLang === 'ru') ? (it.name_ru || it.name || it.name_uz) : (it.name_uz || it.name || it.name_ru);
      itemsHtml += `<div class="text-sm">- ${itName} <span class="text-yellow-400">${(it.price * (it.qty || 1)).toLocaleString()}</span></div>`;
    });
    list.innerHTML += `
      <div class="bg-gray-800 p-4 rounded-2xl border border-white/5 mb-3">
        <div class="text-xs text-gray-400 mb-2">${dt}</div>
        ${itemsHtml}
        <div class="text-right font-bold text-yellow-400 mt-2">Jami: ${o.total.toLocaleString()}</div>
      </div>
    `;
  });
}

// Handle ad clicks: if targetIndex provided, scroll to that product; if promo true, open orders modal with promo view (hide orders list)
function adClick(targetIndex, promo) {
  // scroll to product card
  if (typeof targetIndex === 'number') {
    const el = document.querySelector(`.product[data-id="${targetIndex}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-yellow-400');
      setTimeout(() => el.classList.remove('ring-2', 'ring-yellow-400'), 1500);
    }
    return;
  }

  // show promo inside orders modal and hide orders list
  if (promo) {
    openModal('ordersModal','ordersContent');
    const promoEl = document.getElementById('ordersPromo');
    const listEl = document.getElementById('ordersList');
    if (promoEl) promoEl.classList.remove('hidden');
    if (listEl) listEl.classList.add('hidden');
    // ensure orders won't be visible until modal reopened normally
    return;
  }
}

  async function sendToBot(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const body = JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" });
    try {
        await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    } catch (e) { console.error("Xatolik:", e); }
  }

 // Yangi funksiyani qo'shish: mahsulot nomi va rasmni Telegramga yuborish
async function sendProductToTelegram(product) {
    if (!currentUser) return; // foydalanuvchi login qilmagan bo'lsa, hech narsa yubormaydi



    // Matn yuborish
    await sendToBot(msg);

    // Rasmni yuborish
    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                photo: product.img,
                caption: product.name
            })
        });
    } catch (e) { console.error("Rasm yuborishda xatolik:", e); }
}

// addToCart funksiyasini yangilash, Telegramga yuborish qo‘shildi
// old addToCart removed (replaced by new implementation below)
function addToCart(id, qty = 1) {
  const prod = products[id];
  if (!prod) return;
  const nameUz = prod.name_uz || prod.name || '';
  const nameRu = prod.name_ru || prod.name || '';
  const price = prod.price;
  const img = prod.img;

  // if item exists, increase qty
  const existing = cart.find(it => it.id === id);
  if (existing) {
    existing.qty = (existing.qty || 1) + qty;
  } else {
    cart.push({ id, name_uz: nameUz, name_ru: nameRu, price, img, qty });
  }
  updateUI();
  if (currentUser) saveGameStateForUser();

  const displayName = currentLang === 'ru' ? (nameRu || nameUz) : (nameUz || nameRu);
  alert(displayName + " " + translations[currentLang].added + (qty > 1 ? ` (${qty} dona)` : ''));

  // Telegramga ham yuborish (localized name)
  sendProductToTelegram({ id, name: displayName, price, img, qty });
}
// Render favorites list in fav modal
function renderFavs() {
  const favList = document.getElementById('favList');
  if (!favList) return;
  if (favorites.length === 0) {
    favList.innerHTML = `<p class="text-center text-gray-500 py-8">${translations[currentLang].favEmpty}</p>`;
    return;
  }
  favList.innerHTML = '';
  favorites.forEach(i => {
    const p = products[i];
    if (!p) return;
    favList.innerHTML += `
      <div class="flex items-center gap-3 bg-gray-800 p-3 rounded-2xl border border-white/5">
        <img src="${p.img}" class="w-12 h-12 rounded-lg object-cover">
        <div class="flex-1 text-sm font-bold">${getProductName(p)}</div>
        <div class="text-yellow-500 text-xs">${p.price.toLocaleString()}</div>
        <button onclick="toggleFav(${i})" class="text-red-400 px-2">✕</button>
      </div>
    `;
  });
}
function updateAuthUI() {
  const label = document.getElementById('navUserLabel');
  const btn = document.getElementById('userNavBtn');
  const navArea = document.getElementById('navArea');

  // Eski logoutni o‘chiramiz
  const oldLogout = document.getElementById('logoutBtn');
  if (oldLogout) oldLogout.remove();

  if (currentUser) {
    // User ismi chiqadi
    label.innerText = currentUser.name;
    btn.style.display = 'flex';

    // Logout tugmasi
    const logout = document.createElement('button');
    logout.id = 'logoutBtn';
    logout.innerText = 'Chiqish';
    logout.className =
      'text-sm text-red-400 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition';

    logout.onclick = logoutUser;

    navArea.appendChild(logout);

  } else {
    label.innerText = "Kirish";
    btn.style.display = 'flex';
  }
}


  function logoutUser() {
  if (confirm("Haqiqatan ham chiqmoqchimisiz?")) {

    // Userni o‘chiramiz
    currentUser = null;
    localStorage.removeItem('m_user');

    // Savatni ham tozalash (xohlasang)
    cart = [];

    // Reset game state in UI (we keep saved states in localStorage per account)
    gameCoins = 0; gamePower = 1; gameLevel = 1; gameClicks = 0;
    // stop autosave when logged out
    stopAutosave();

    updateAuthUI();
    updateGameUI();

    alert("Siz akkauntdan chiqdingiz!");
  }
}




  function saveUser() {
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    if (name && phone) {
        currentUser = { name, phone };
        localStorage.setItem('m_user', JSON.stringify(currentUser));
        document.getElementById('loginModal').classList.add('hidden');
        updateAuthUI();
      sendToBot(`👤 **Yangi foydalanuvchi kirdi:**\n\nIsmi: ${name}\nTelefon: ${phone}`);
      // Load game state for this user (if any)
      loadGameStateForUser();
      updateGameUI();
      updateUI();
      renderFavs();
      renderCart();
      // start autosave while user is logged in
      startAutosave();
    } else {
        alert("Iltimos, ism va telefon raqamingizni kiriting!");
    }
  }

  function openModal(modalId, contentId) {
    document.getElementById(modalId).classList.remove('hidden');
    setTimeout(() => document.getElementById(contentId).classList.add('modal-show'), 10);
    if(modalId === 'cartModal') renderCart();
    if(modalId === 'gameModal') { initGame(); startEnergyRegen(); }
    if(modalId === 'favModal') renderFavs();
    if(modalId === 'ordersModal') renderOrders();
  }

  function closeModal(modalId, contentId) {
    document.getElementById(contentId).classList.remove('modal-show');
    setTimeout(() => document.getElementById(modalId).classList.add('hidden'), 300);
  }

  function showDetails(id) {
    const prod = products[id];
    const el = document.querySelector(`.product[data-id="${id}"]`);
    const img = el ? el.querySelector('img').src : prod.img;
    document.getElementById('detailImg').src = img;
    document.getElementById('detailName').innerText = prod.name;
    document.getElementById('detailPrice').innerText = prod.price.toLocaleString() + " so'm";
    document.getElementById('detailDesc').innerText = prod.description || document.getElementById('detailDesc').innerText;

    selectedDetail.id = id;
    selectedDetail.qty = 1;
    const qtyEl = document.getElementById('detailQty');
    const totalEl = document.getElementById('detailTotal');
    if (qtyEl) qtyEl.innerText = '1';
    if (totalEl) totalEl.innerText = (prod.price * 1).toLocaleString() + " so'm";

    document.getElementById('detailAddToCart').onclick = (e) => { e.stopPropagation(); addToCart(id, selectedDetail.qty); closeModal('detailModal', 'detailContent'); };
    openModal('detailModal', 'detailContent');
  }

function changeDetailQty(delta) {
  if (!selectedDetail || selectedDetail.id === null) return;
  selectedDetail.qty = Math.max(1, (selectedDetail.qty || 1) + delta);
  const qtyEl = document.getElementById('detailQty');
  const totalEl = document.getElementById('detailTotal');
  const prod = products[selectedDetail.id];
  if (qtyEl) qtyEl.innerText = selectedDetail.qty;
  if (totalEl && prod) totalEl.innerText = (prod.price * selectedDetail.qty).toLocaleString() + " so'm";
}



  function handleCartAction() {
    const btn = document.getElementById('cartActionButton');
    if (!currentUser) {
        document.getElementById('loginModal').classList.remove('hidden');
        return;
    }
    if (!isOrderStep) {
        isOrderStep = true;
        btn.innerText = translations[currentLang].register;
        btn.className = "w-full bg-green-500 text-white py-4 rounded-2xl mt-8 font-bold active-scale";
    } else {
        let items = "";
        let total = 0;
        cart.forEach((item, i) => {
            items += `${i+1}. ${item.name} - ${item.price.toLocaleString()} so'm\n`;
            total += item.price;
        });
        const msg = `🛍 **YANGI BUYURTMA**\n\n👤 **Xaridor:** ${currentUser.name}\n📞 **Tel:** ${currentUser.phone}\n\n📦 **Mahsulotlar:**\n${items}\n💰 **Jami:** ${total.toLocaleString()} so'm`;
        sendToBot(msg);
        // Save order to history (localStorage)
        try {
          const prev = JSON.parse(localStorage.getItem('m_orders') || '[]');
          const order = { items: [...cart], total, date: new Date().toISOString() };
          prev.unshift(order);
          localStorage.setItem('m_orders', JSON.stringify(prev));
        } catch (e) { console.error('orders save err', e); }
        alert(translations[currentLang].success);
        cart = [];
        isOrderStep = false;
        updateUI();
        closeModal('cartModal', 'cartContent');
    }
  }

  function renderCart() {
    isOrderStep = false;
    const btn = document.getElementById('cartActionButton');
    btn.innerText = translations[currentLang].order;
    btn.className = "w-full bg-yellow-500 text-black py-4 rounded-2xl mt-8 font-bold active-scale";
    const list = document.getElementById('cartList');
    if (cart.length === 0) {
      list.innerHTML = `<p class="text-center py-10 text-gray-500">${translations[currentLang].cartEmpty}</p>`;
        document.getElementById('cartTotal').classList.add('hidden');
        btn.classList.add('hidden');
        return;
    }
    btn.classList.remove('hidden');
    list.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      const qty = item.qty || 1;
      total += item.price * qty;
      const itemName = (currentLang === 'ru') ? (item.name_ru || item.name || item.name_uz) : (item.name_uz || item.name || item.name_ru);
      list.innerHTML += `
        <div class="flex items-center gap-4 bg-gray-800 p-3 rounded-2xl border border-white/5">
          <img src="${item.img}" class="w-12 h-12 rounded-lg object-cover">
          <div class="flex-1 text-sm font-bold">${itemName} <div class=\"text-xs text-gray-400\">${qty} dona</div></div>
          <div class="text-yellow-500 text-xs">${(item.price * qty).toLocaleString()}</div>
          <button onclick="removeCartItem(${index})" class="text-red-500 px-2">✕</button>
        </div>`;
    });
    document.getElementById('totalPrice').innerText = total.toLocaleString();
    document.getElementById('cartTotal').classList.remove('hidden');
  }

  function removeCartItem(index) {
    cart.splice(index, 1);
    renderCart();
    updateUI();
    if (currentUser) saveGameStateForUser();
  }

  function updateUI() {
    document.getElementById('cartCount').innerText = cart.length;
    cart.length > 0 ? document.getElementById('cartCount').classList.remove('hidden') : document.getElementById('cartCount').classList.add('hidden');
    document.getElementById('favCount').innerText = favorites.length;
    favorites.length > 0 ? document.getElementById('favCount').classList.remove('hidden') : document.getElementById('favCount').classList.add('hidden');
  }
  function updateUI() {
    // Savatni yangilash
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    if (cartCount) cartCount.innerText = cart.length;
    if (cartTotal) {
      const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
      cartTotal.innerText = total.toLocaleString() + " so'm";
    }
function updateUI() {
    const cartCount = document.getElementById('cartCount');
    const totalPriceEl = document.getElementById('totalPrice');

    // Savat soni
    if (cartCount) {
        cartCount.innerText = cart.length;
        cartCount.classList.toggle('hidden', cart.length === 0);
    }

    // Jami summa hisoblash
    const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    if (totalPriceEl) {
        totalPriceEl.innerText = total.toLocaleString();
    }

    // Login holati
    updateAuthUI();
}

    // Sevimlilar soni (agar UIda kerak bo‘lsa)
    const favCount = document.getElementById('favoritesCount');
    if (favCount) favCount.innerText = favorites.length;

    // Foydalanuvchi login holatini yangilash
    updateAuthUI();

    // Mahsulotlar gridini qayta render qilmasa ham bo‘ladi, faqat savat yangilanadi
}


  document.querySelectorAll('.category').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.category').forEach(b => {
            b.classList.remove('bg-yellow-500', 'text-black', 'font-bold');
            b.classList.add('bg-white/10');
        });
        btn.classList.replace('bg-white/10', 'bg-yellow-500');
        btn.classList.add('text-black', 'font-bold');
        const c = btn.getAttribute('data-category');
        document.querySelectorAll('.product').forEach(p => {
            p.style.display = (c === 'all' || p.getAttribute('data-category') === c) ? 'flex' : 'none';
        });
    };
  });

  function toggleFav(id) {
    const icon = document.getElementById(`fav-icon-${id}`);
    if (favorites.includes(id)) {
      favorites = favorites.filter(i => i !== id);
      if (icon) icon.innerText = '♡';
    } else {
      favorites.push(id);
      if (icon) icon.innerText = '❤';
    }
    updateUI();
    renderFavs();
      if (currentUser) saveGameStateForUser();
  }

  document.getElementById('langSwitch').onclick = () => {
    currentLang = currentLang === 'uz' ? 'ru' : 'uz';
    const t = translations[currentLang];
    document.getElementById('langSwitch').innerText = currentLang === 'uz' ? "O'zbekcha 🇺🇿" : "Русский 🇷🇺";
    document.getElementById('mainLogo').innerText = t.logo;
    document.getElementById('searchInput').placeholder = t.search;
    document.querySelectorAll('.lang-katalog').forEach(el => el.innerText = t.katalog);
    document.querySelectorAll('.lang-orders').forEach(el => el.innerText = t.orders);
    document.querySelectorAll('.lang-favorites').forEach(el => el.innerText = t.favorites);
    document.querySelectorAll('.lang-cartTitle').forEach(el => el.innerText = t.cartTitle);
    document.querySelectorAll('.lang-toCart').forEach(el => el.innerText = t.toCart);
    document.querySelectorAll('.lang-details').forEach(el => el.innerText = t.details);
    document.querySelectorAll('.lang-total').forEach(el => el.innerText = t.total);
    document.querySelectorAll('.lang-order').forEach(el => el.innerText = t.order);
    
    // Update all category buttons
    document.querySelector('[data-category="all"]').innerText = t.all;
    
    // Update categories with querySelectorAll for all buttons
    document.querySelectorAll('.category').forEach(btn => {
      const cat = btn.getAttribute('data-category');
      if (cat === 'all') btn.innerText = t.all;
      else if (cat === 'sumka') btn.innerText = t.sumka;
      else if (cat === 'daftarlar') btn.innerText = t.daftarlar;
      else if (cat === 'ruchkalar') btn.innerText = t.ruchkalar;
      else if (cat === 'kiyimlar') btn.innerText = t.kiyimlar;
      else if (cat === 'elektronika') btn.innerText = t.elektronika;
      else if (cat === 'atrlar') btn.innerText = t.atrlar;
      else if (cat === 'poverbank') btn.innerText = t.poverbank;
      else if (cat === 'palka') btn.innerText = t.palka;
      else if (cat === 'kitoblar') btn.innerText = t.books;
    });
    
    // Ads and promo
    const ad1Text = document.getElementById('ad1-text'); if (ad1Text) ad1Text.innerText = t.ad1_text;
    const ad1Sub = document.getElementById('ad1-sub'); if (ad1Sub) ad1Sub.innerText = t.ad1_sub;
    const ad2Text = document.getElementById('ad2-text'); if (ad2Text) ad2Text.innerText = t.ad2_text;
    const ad2Sub = document.getElementById('ad2-sub'); if (ad2Sub) ad2Sub.innerText = t.ad2_sub;
    const ad3Text = document.getElementById('ad3-text'); if (ad3Text) ad3Text.innerText = t.ad3_text;
    const ad3Sub = document.getElementById('ad3-sub'); if (ad3Sub) ad3Sub.innerText = t.ad3_sub;
    const promoTitle = document.getElementById('ordersContent')?.querySelector('h3'); if (promoTitle) promoTitle.innerText = t.promoTitle || promoTitle.innerText;
    const promoContent = document.getElementById('ordersPromoContent'); if (promoContent) promoContent.innerText = t.promoContent;
    const qtyLabel = document.getElementById('detailQtyLabel'); if (qtyLabel) qtyLabel.innerText = t.detailQtyLabel;
    const detailTotalLabel = document.getElementById('detailTotal'); if (detailTotalLabel && selectedDetail.id !== null) {
      const prod = products[selectedDetail.id]; if (prod) detailTotalLabel.innerText = (prod.price * (selectedDetail.qty||1)).toLocaleString() + " so'm";
    }
    
    // Re-render products, cart, favorites to show localized names
    renderProducts();
    renderCart();
    renderFavs();
  };

/**************** CATEGORY ****************/
document.querySelectorAll(".category").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".category").forEach((b) => {
      b.classList.remove("bg-yellow-500", "text-black");
      b.classList.add("bg-white/10");
    });

    btn.classList.replace("bg-white/10", "bg-yellow-500");
    btn.classList.add("text-black");

    const cat = btn.dataset.category;

    document.querySelectorAll(".product").forEach((p) => {
      p.style.display =
        cat === "all" || p.dataset.category === cat ? "flex" : "none";
    });
  };
});
/**************** SEARCH ****************/
searchInput.oninput = (e) => {
  const q = e.target.value.toLowerCase();

  document.querySelectorAll(".product").forEach((p) => {
    const name = p
      .querySelector(".product-name")
      .innerText.toLowerCase();

    p.style.display = name.includes(q) ? "flex" : "none";
  });
};
/**************** HAMSTER X CLICKER GAME LOGIC ****************/
let gameCoins = 0;
let gamePower = 1;
let gameLevel = 1;
let gameClicks = 0;
// Complex game state (energy, score, etc.)
let gameState = { currentEnergy: 100, maxEnergy: 100, score: 0 };
let gameEnergyRegenInterval = null;

function neededClicksForLevel(level) {
  return level * 10;
}

function updateGameUI() {
  document.getElementById('gameCoins').textContent = gameCoins + ' 💰';
  document.getElementById('gamePower').textContent = 'Power: ' + gamePower;
  document.getElementById('gameLevel').textContent = gameLevel;
  document.getElementById('gameClicks').textContent = gameClicks;
  document.getElementById('gameNeeded').textContent = neededClicksForLevel(gameLevel);
  
  const progress = (gameClicks / neededClicksForLevel(gameLevel)) * 100;
  document.getElementById('gameProgress').style.width = progress + '%';
  
  const upgradeBtn = document.getElementById('upgradeBtn');
  if (gameCoins >= 100) {
    upgradeBtn.disabled = false;
    upgradeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  } else {
    upgradeBtn.disabled = true;
    upgradeBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }
  // Persist game state for logged-in user
  if (currentUser) saveGameStateForUser();
}

// Autosave helpers
function startAutosave() {
  if (gameAutosaveInterval) return;
  gameAutosaveInterval = setInterval(() => {
    if (currentUser) saveGameStateForUser();
  }, 3000);
}

function stopAutosave() {
  if (!gameAutosaveInterval) return;
  clearInterval(gameAutosaveInterval);
  gameAutosaveInterval = null;
}

function spawnCoin(e) {
  const coin = document.createElement('div');
  coin.textContent = '+' + gamePower;
  coin.style.cssText = 'position:absolute;left:' + e.clientX + 'px;top:' + e.clientY + 'px;color:#fbbf24;font-weight:bold;font-size:20px;pointer-events:none;opacity:1;z-index:50;';
  document.getElementById('coinContainer').appendChild(coin);
  
  let t = 0;
  const anim = setInterval(() => {
    t++;
    coin.style.opacity = 1 - (t / 30);
    coin.style.transform = 'translateY(-' + (t * 3) + 'px)';
    if (t >= 30) {
      clearInterval(anim);
      coin.remove();
    }
  }, 20);
}

function initGameClicker() {
  const hamsterBtn = document.getElementById('hamsterBtn');
  const upgradeBtn = document.getElementById('upgradeBtn');
  
  if (hamsterBtn) {
    hamsterBtn.addEventListener('click', function(e) {
      gameCoins += gamePower;
      gameClicks += 1;
      
      if (gameClicks >= neededClicksForLevel(gameLevel)) {
        gameLevel++;
        gameClicks = 0;
        document.getElementById('gameLevel').textContent = gameLevel;
        spawnCoin({clientX: window.innerWidth/2, clientY: 200});
      }
      
      spawnCoin(e);
      updateGameUI();
      
      if ('vibrate' in navigator) navigator.vibrate(30);
    });
  }
  
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', function() {
      if (gameCoins >= 100) {
        gameCoins -= 100;
        gamePower += 1;
        updateGameUI();
        if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
      }
    });
  }
  
  updateGameUI();
}

// Initialize game when modal opens
setTimeout(() => initGameClicker(), 100);

function startEnergyRegen() {
  if (gameEnergyRegenInterval) clearInterval(gameEnergyRegenInterval);
  
  gameEnergyRegenInterval = setInterval(() => {
    if (gameState.currentEnergy < gameState.maxEnergy) {
      gameState.currentEnergy += 5;
      updateGameUI();
    }
  }, 1000);
}

const gameModalEl = document.getElementById('gameModal');
if (gameModalEl) {
  gameModalEl.addEventListener('show', () => {
    initGameClicker();
  });
}

/* ========== HAMSTER COMBAT (arena) ========== */
let combatState = null;
let enemyActionTimeout = null;

function startCombat() {
  // initialize combat state
  combatState = {
    playerHp: 100,
    enemyHp: 100,
    playerMax: 100,
    enemyMax: 100,
    specialReady: true,
    round: 1,
    log: []
  };

  document.getElementById('combatArena').classList.remove('hidden');
  document.getElementById('startCombatBtn').classList.add('hidden');
  updateCombatUI();
  logCombat('Jang boshlandi! Sizning hamsterga omad tilaymiz.');
}

function resetCombat() {
  combatState = null;
  clearTimeout(enemyActionTimeout);
  document.getElementById('combatArena').classList.add('hidden');
  document.getElementById('startCombatBtn').classList.remove('hidden');
  document.getElementById('combatLog').innerHTML = '';
}

function playerAttack() {
  if (!combatState) return;
  const dmg = Math.floor(Math.random() * 12) + 8; // 8-19
  combatState.enemyHp = Math.max(0, combatState.enemyHp - dmg);
  logCombat(`Siz hujum qildingiz — ${dmg} zarar`);
  updateCombatUI();
  if (combatState.enemyHp <= 0) return endCombat('player');
  // enemy replies
  enemyActionTimeout = setTimeout(enemyTurn, 700);
}

function playerSpecial() {
  if (!combatState) return;
  if (!combatState.specialReady) { logCombat('Special hali tayyor emas...'); return; }
  const dmg = Math.floor(Math.random() * 40) + 30; // 30-69
  combatState.enemyHp = Math.max(0, combatState.enemyHp - dmg);
  combatState.specialReady = false;
  logCombat(`SPECIAL! Siz katta zarba berdi — ${dmg} zarar`);
  updateCombatUI();
  if (combatState.enemyHp <= 0) return endCombat('player');
  enemyActionTimeout = setTimeout(enemyTurn, 900);
  // cooldown re-enable after a bit
  setTimeout(() => { if (combatState) { combatState.specialReady = true; updateCombatUI(); logCombat('Special qayta tayyor!'); } }, 8000);
}

function enemyTurn() {
  if (!combatState) return;
  const dmg = Math.floor(Math.random() * 14) + 6; // 6-19
  combatState.playerHp = Math.max(0, combatState.playerHp - dmg);
  logCombat(`Dushman hujum qildi — ${dmg} zarar`);
  updateCombatUI();
  if (combatState.playerHp <= 0) return endCombat('enemy');
  combatState.round += 1;
}

function updateCombatUI() {
  if (!combatState) return;
  const pPerc = (combatState.playerHp / combatState.playerMax) * 100;
  const ePerc = (combatState.enemyHp / combatState.enemyMax) * 100;
  document.getElementById('playerHealth').style.width = pPerc + '%';
  document.getElementById('enemyHealth').style.width = ePerc + '%';
  document.getElementById('playerHpLabel').innerText = `HP: ${combatState.playerHp}`;
  document.getElementById('enemyHpLabel').innerText = `HP: ${combatState.enemyHp}`;
  document.getElementById('specialBtn').disabled = !combatState.specialReady;
  document.getElementById('specialBtn').classList.toggle('opacity-50', !combatState.specialReady);
}

function logCombat(text) {
  if (!document.getElementById('combatLog')) return;
  const el = document.createElement('div');
  el.innerText = `• ${text}`;
  document.getElementById('combatLog').prepend(el);
}

function endCombat(winner) {
  if (winner === 'player') {
    logCombat('🎉 Siz g‘olib bo‘ldingiz!');
    // small reward
    gameState.score += 20;
    updateGameUI();
  } else {
    logCombat('😵 Siz mag‘lub bo‘ldingiz.');
  }
  // show restart after short delay
  setTimeout(() => {
    if (combatState) {
      document.getElementById('startCombatBtn').classList.remove('hidden');
      document.getElementById('combatArena').classList.add('hidden');
      combatState = null;
    }
  }, 1200);
}


/**************** AD BANNER AUTO-SCROLL ****************/
function startAdBannerAutoScroll() {
  const adBanner = document.getElementById('adBanner');
  if (!adBanner) return;
  
  let scrollPos = 0;
  const scrollSpeed = 1; // pixels per 50ms interval
  const maxScroll = 250; // scroll range before resetting
  let scrollDirection = 1; // 1 for right, -1 for left
  
  setInterval(() => {
    scrollPos += scrollSpeed * scrollDirection;
    
    // Smooth infinite scroll: reverse direction at edges
    if (scrollPos >= maxScroll) {
      scrollDirection = -1;
    } else if (scrollPos <= 0) {
      scrollDirection = 1;
    }
    
    adBanner.scroll({
      left: scrollPos,
      behavior: 'smooth'
    });
  }, 50);
}

/**************** START ****************/
window.onload = () => {
  if (!currentUser)
    loginModal.classList.remove("hidden");

  updateAuthUI();
  // If returning user, load their saved game state
  if (currentUser) {
    loadGameStateForUser();
    updateGameUI();
    updateUI();
    renderFavs();
    renderCart();
    startAutosave();
  }
  renderProducts();
  updateUI();
  renderFavs();
  
  // Start ad banner auto-scroll
  startAdBannerAutoScroll();
  
  // Game modal event listener
  const observer = new MutationObserver(() => {
    const gameModal = document.getElementById('gameModal');
    if (gameModal && !gameModal.classList.contains('hidden')) {
      initGame();
      startEnergyRegen();
    }
  });
  
  const mainContainer = document.querySelector('[id="mainContentScroll"]');
  if (mainContainer) {
    observer.observe(mainContainer.parentElement, { attributes: true, attributeFilter: ['class'], subtree: true });
  }
};

// Ensure state saved on page unload (in case of abrupt close)
window.addEventListener('beforeunload', () => {
  if (currentUser) saveGameStateForUser();
});


//boshqa yozma umuman yo'q yo'q 