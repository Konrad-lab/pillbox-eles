import type { ProductRow } from "./types";

/**
 * Permanent product catalogue - shaped exactly like the "products" sheet.
 * Swapping this array for a Google Sheets / Docs API fetch requires no
 * changes anywhere else in the app (see `productCatalogSource`).
 */
export const MOCK_PRODUCT_ROWS: ProductRow[] = [
  {
    product_id: "PB-P001",
    name: "D3-vitamin 2000 IU",
    price_huf: 2490,
    category: "Vitaminok",
    short_info: "Napi D3-vitamin az immunrendszer támogatására.",
    description:
      "Magas hatóanyag-tartalmú D3-vitamin lágyzselatin kapszula. Hozzájárul az immunrendszer normál működéséhez, valamint a csontok és izmok egészségének megőrzéséhez. Étrend-kiegészítő, napi 1 kapszula étkezés közben.",
    package_size: "60 db kapszula",
    manufacturer: "Pillbox Selection",
  },
  {
    product_id: "PB-P002",
    name: "Magnézium + B6",
    price_huf: 2890,
    category: "Vitaminok",
    short_info: "Fáradtság és izomgörcsök ellen.",
    description:
      "Szerves magnézium B6-vitaminnal kombinálva. Hozzájárul a fáradtság és kifáradás csökkentéséhez, valamint az idegrendszer és az izmok normál működéséhez.",
    package_size: "30 db tabletta",
    manufacturer: "Pillbox Selection",
  },
  {
    product_id: "PB-P003",
    name: "C-vitamin 1000 mg",
    price_huf: 1990,
    category: "Vitaminok",
    short_info: "Retard C-vitamin csipkebogyó-kivonattal.",
    description:
      "Nyújtott felszívódású C-vitamin tabletta, amely egész nap támogatja az immunrendszer normál működését és csökkenti a fáradtságérzetet.",
    package_size: "30 db tabletta",
    manufacturer: "Pillbox Selection",
  },
  {
    product_id: "PB-P004",
    name: "Ibuprofén 400 mg",
    price_huf: 1690,
    category: "Fájdalomcsillapítás",
    short_info: "Fejfájás, izomfájdalom és láz esetére.",
    description:
      "Vény nélkül kapható fájdalom- és lázcsillapító filmtabletta. Használat előtt olvassa el a betegtájékoztatót! A kockázatokról és a mellékhatásokról olvassa el a betegtájékoztatót, vagy kérdezze meg kezelőorvosát, gyógyszerészét.",
    package_size: "10 db filmtabletta",
  },
  {
    product_id: "PB-P005",
    name: "Paracetamol 500 mg",
    price_huf: 1290,
    category: "Fájdalomcsillapítás",
    short_info: "Enyhe fájdalom és láz csillapítására.",
    description:
      "Széles körben alkalmazott láz- és fájdalomcsillapító tabletta felnőttek részére. A kockázatokról és a mellékhatásokról olvassa el a betegtájékoztatót, vagy kérdezze meg kezelőorvosát, gyógyszerészét.",
    package_size: "20 db tabletta",
  },
  {
    product_id: "PB-P006",
    name: "Steril sebtapasz csomag",
    price_huf: 990,
    category: "Elsősegély",
    short_info: "Vegyes méretű, légáteresztő sebtapaszok.",
    description:
      "Steril, hipoallergén sebtapaszok kisebb vágások és horzsolások ellátására. Vegyes méretben, egyenként csomagolva.",
    package_size: "20 db",
  },
  {
    product_id: "PB-P007",
    name: "Fertőtlenítő spray",
    price_huf: 1590,
    category: "Elsősegély",
    short_info: "Bőrfertőtlenítő kisebb sérülésekre.",
    description:
      "Alkoholmentes, csípésmentes bőrfertőtlenítő spray sebek és horzsolások tisztítására. Gyerekeknek is használható.",
    package_size: "50 ml",
  },
  {
    product_id: "PB-P008",
    name: "Kézfertőtlenítő gél",
    price_huf: 890,
    category: "Higiénia",
    short_info: "Zsebméretű, 70% alkoholtartalmú gél.",
    description:
      "Gyorsan száradó kézfertőtlenítő gél glicerinnel, amely nem szárítja ki a bőrt. Utazáshoz és mindennapi használatra.",
    package_size: "50 ml",
  },
  {
    product_id: "PB-P009",
    name: "Zsebkendő csomag",
    price_huf: 390,
    category: "Higiénia",
    short_info: "Háromrétegű papír zsebkendő.",
    description: "Puha, háromrétegű papír zsebkendő kisméretű, útra tervezett csomagolásban.",
    package_size: "10 db",
  },
  {
    product_id: "PB-P010",
    name: "Nedves törlőkendő",
    price_huf: 690,
    category: "Higiénia",
    short_info: "Alkoholmentes, bőrbarát tisztítás.",
    description:
      "Bőrgyógyászatilag tesztelt nedves törlőkendő aloe verával, mindennapi frissítéshez és kézmosás pótlására.",
    package_size: "15 db",
  },
  {
    product_id: "PB-P011",
    name: "Allergia tabletta",
    price_huf: 1890,
    category: "Szezonális",
    short_info: "Szénanátha és allergiás tünetek ellen.",
    description:
      "Antihisztamin tabletta szezonális allergiás tünetek - tüsszögés, orrfolyás, viszkető szem - enyhítésére. A kockázatokról és a mellékhatásokról olvassa el a betegtájékoztatót, vagy kérdezze meg kezelőorvosát, gyógyszerészét.",
    package_size: "10 db tabletta",
  },
  {
    product_id: "PB-P012",
    name: "Torokfertőtlenítő pasztilla",
    price_huf: 1490,
    category: "Szezonális",
    short_info: "Torokfájás és rekedtség enyhítésére.",
    description:
      "Mentol- és eukaliptusztartalmú pasztilla, amely nyugtatja a torkot és enyhíti a rekedtséget.",
    package_size: "24 db pasztilla",
  },
  {
    product_id: "PB-P013",
    name: "Elektrolit italpor",
    price_huf: 1290,
    category: "Mindennapi egészség",
    short_info: "Folyadék- és ásványianyag-pótlás.",
    description:
      "Cukormentes elektrolit italpor nátriummal, káliummal és magnéziummal - sport, hőség vagy betegség utáni rehidratáláshoz.",
    package_size: "6 tasak",
  },
  {
    product_id: "PB-P014",
    name: "Ajakápoló SPF 20",
    price_huf: 990,
    category: "Mindennapi egészség",
    short_info: "Hidratálás és UV-védelem.",
    description: "Sheavajas ajakápoló balzsam SPF 20 fényvédelemmel, kirepedezett ajkakra.",
    package_size: "4,8 g",
  },
  {
    product_id: "PB-P015",
    name: "Szemcsepp",
    price_huf: 1790,
    category: "Mindennapi egészség",
    short_info: "Száraz, irritált szemre.",
    description:
      "Hialuronsav-tartalmú műkönny, amely tartós nedvességet biztosít képernyő előtti munka vagy légkondicionált környezet esetén.",
    package_size: "10 ml",
  },
];
