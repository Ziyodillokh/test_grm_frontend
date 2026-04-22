import {
  BellRingingIcon,
  BronedIcons,
  ClientsIcon,
  DataLibrary,
  DiamondIcon,
  HikVision,
  HomeIcons,
  NotPublishedIcons,
  OrderIcons,
  PartiesIcons,
  PersonsIcons,
  PriceIcons,
  ProductCharacteristics,
  ProductIcons,
  ProductsOnSaleIcon,
  QRCodeIcon,
  ReportBottom,
  StatementIcon,
  TransferIcons,
  UfoBottom,
} from "../../components/icons";
import {
  DeviceAnalyticsIcon,
  FileTextIcon,
  RefreshCcwIcon,
  ShoppingCartIcon,
  TagIcon,
  UsersIcon,
  BooksIcon,
} from "./sidebar-icons";

// {
//   OTHER = 0,
//   CLIENT = 1,
//   F_MANAGER = 4,
//   DEALER = 5,
//   D_MANAGER = 6,
//   W_MANAGER = 7,
//   I_MANAGER = 8,
//   M_MANAGER = 9,
//   ACCOUNTANT = 10,
//   HR = 11,
//   BOSS = 12
// }

export const DataMenu = {
  // Key 3 (CASHIER) removed — merged into key 4 (F_MANAGER)
  4: [
    {
      id: 0,
      icons: () => DeviceAnalyticsIcon(),
      link: "/f-manager/kassa",
      text: "Kassa",
      headerText: "Joriy Oy Kassasi",
    },
    {
      id: 2,
      icons: () => FileTextIcon(),
      link: "/f-manager/reports-hub",
      text: "Hisobotlar",
    },
    {
      id: 32,
      icons: () => RefreshCcwIcon(),
      link: "/transfers",
      text: "Transfer",
    },
    {
      id: 3,
      icons: () => ShoppingCartIcon(),
      link: "/products",
      text: "Mahsulotlar",
    },
    {
      id: 4,
      icons: () => BronedIcons(),
      link: "/broned",
      text: "Bronlar",
    },
    {
      id: 42,
      icons: () => TagIcon(),
      link: "/price",
      text: "Narx-navo",
    },
    {
      id: 5,
      icons: () => ClientsIcon(),
      link: "/user",
      text: "Ishchilar boshqaruvi",
    },
    {
      id: 6,
      icons: () => UsersIcon(),
      link: "/client",
      text: "Mijozlar",
    },
    {
      id: 7,
      icons: () => ReportBottom({}),
      link: "/filial/my-filial/info",
      text: "Pereuchot",
    },
    {
      id: 8,
      icons: () => BooksIcon(),
      link: "/data-library",
      text: "Markaziy ma'lumotlar",
    },
  ],
  5: [
    {
      id: 2,
      icons: () => ReportBottom({}),
      link: "/report",
      text: "Отчеты",
      items: [
        {
          id: 22,
          link: "/report",
          text: "Кассовый учёт",
        },
        {
          id: 23,
          link: "/report-item-2",
          text: "Финансовый учёт",
        },
        {
          id: 24,
          link: "/report-item-3",
          text: "Снабжение и документооборот",
        },
      ],
    },
    {
      id: 14,
      icons: () => TransferIcons(),
      link: "/transfers",
      text: "transfers",
    },
    {
      id: 2,
      icons: () => ProductIcons(),
      link: "/products",
      text: "Продукты",
    },
    {
      id: 3,
      icons: () => PartiesIcons(),
      link: "/parties",
      text: "Партии",
    },
    {
      id: 3,
      icons: () => BronedIcons(),
      link: "/broned",
      text: "broned",
    },
    {
      id: 3,
      icons: () => HikVision(),
      link: "/hik-vision",
      text: "Hik Vision",
    },
    {
      id: 4,
      icons: () => PersonsIcons(),
      link: "/user",
      text: "user",
    },
    {
      id: 4,
      icons: () => PriceIcons({}),
      link: "/price",
      text: "Цени и скидки",
    },
    // {
    //   id: 3,
    //   icons: () => ProductsCheck(),
    //   link: "/product-check",
    //   text: "Проверка продукта",
    // },

    {
      id: 4,
      icons: () => DataLibrary({}),
      link: "/data-library",
      text: "data-library",
    },
  ],
  6: [
    {
      id: 2,
      icons: () => ReportBottom({}),
      link: "/d-manager/reports-hub",
      text: "Hisobotlar",
    },
    {
      id: 14,
      icons: () => TransferIcons(),
      link: "/d-manager/transfer",
      text: "Трансферы",
    },
  ],
  7: [
    // {
    //   id: 1,
    //   icons: () => ReportBottom({}),
    //   link: "/warehouse-report",
    //   text: "Отчет об остатке",
    // },
    {
      id: 2,
      icons: () => PartiesIcons(),
      link: "/parties",
      text: "Партии",
    },
    {
      id: 3,
      icons: () => TransferIcons(),
      link: "/transfers",
      text: "Трансферы",
    },
    {
      id: 4,
      icons: () => ProductIcons(),
      link: "/products",
      text: "Продукты ",
    },
    {
      id: 5,
      icons: () => BronedIcons(),
      link: "/broned",
      text: "broned",
    },
    {
      id: 6,
      icons: () => HikVision(),
      link: "/hik-vision",
      text: "Hik Vision",
    },
    {
      id: 7,
      icons: () => PersonsIcons(),
      link: "/user",
      text: "user",
    },
    {
      id: 8,
      icons: () => PriceIcons({}),
      link: "/price",
      text: "Цени и скидки",
    },
    // {
    //   id: 9,
    //   icons: () => ProductsCheck(),
    //   link: "/product-check",
    //   text: "Проверка продукта",
    // },
    {
      id: 10,
      icons: () => QRCodeIcon(),
      link: "/qrcode",
      text: "Генерация QR-кодов",
    },

    {
      id: 11,
      icons: () => DataLibrary({}),
      link: "/data-library",
      text: "data-library",
    },
    {
      id: 23,
      icons: () => ClientsIcon(),
      link: "/filial/my-filial/info",
      text: "переучет",
    },
  ],
  8: [
    {
      id: 0,
      icons: () => HomeIcons(),
      link: "/cashier/home",
      text: "Касса",
    },
    {
      id: 2,
      icons: () => ReportBottom({}),
      link: "/f-manager/report-finance",
      text: "Отчеты",
      items: [
        {
          id: 22,
          link: "/f-manager/reports",
          text: "Касса магазина",
        },
        {
          id: 23,
          link: "/f-manager/report-finance",
          text: "Ежемесячный отчет",
        },
        {
          id: 24,
          link: "/f-manager/report-remaider",
          text: "Отчет об остатке",
        },
        {
          id: 25,
          link: "/f-manager/report-seller",
          text: "Отчёт по сотрудикам",
        },
        {
          id: 26,
          link: "/f-manager/report-orginal",
          text: "Хисобот",
        },

      ],
    },
    {
      id: 1,
      icons: () => ProductsOnSaleIcon(),
      link: "/i-products",
      text: "Продукты в продаже",
    },
    {
      id: 2,
      icons: () => OrderIcons(),
      link: "/order",
      text: "Заказы",
    },
    {
      id: 3,
      icons: () => NotPublishedIcons(),
      link: "/not-published-products",
      text: "Не опубликованные",
    },

    {
      id: 5,
      icons: () => ClientsIcon(),
      link: "/clients",
      text: "Клиенты",
    },
    {
      id: 6,
      icons: () => PriceIcons({}),
      link: "/price",
      text: "Цени и скидки",
    },
    {
      id: 7,
      icons: () => ProductCharacteristics(),
      link: "/product-characteristics",
      text: "Характеристика продуктов",
    },

    {
      id: 8,
      icons: () => QRCodeIcon(),
      link: "/qr-logo",
      text: "QR-логотип",
    },
    {
      id: 9,
      icons: () => TransferIcons(),
      link: "/transfers",
      text: "Трансферы",
    },
    // {
    //   id: 10,
    //   icons: () => SettingsIcon(),
    //   link: "/settings",
    //   text: "Настройка",
    // },
    {
      id: 50,
      icons: () => BellRingingIcon(),
      link: "/xabarnoma",
      text: "Xabarnomalar",
    },
  ],
  9: [
    {
      id: 0,
      icons: () => DeviceAnalyticsIcon(),
      link: "/m-manager/current-month",
      text: "Joriy Oy",
    },
    {
      id: 2,
      icons: () => FileTextIcon(),
      link: "/m-manager/reports-hub",
      text: "Hisobotlar",
    },
    {
      id: 32,
      icons: () => RefreshCcwIcon(),
      link: "/transfers",
      text: "Transferlar",
    },
    {
      id: 33,
      icons: () => PartiesIcons(),
      link: "/parties",
      text: "Partiyalar",
    },
    {
      id: 3,
      icons: () => ShoppingCartIcon(),
      link: "/products",
      text: "Mahsulotlar",
    },
    {
      id: 42,
      icons: () => TagIcon(),
      link: "/price",
      text: "Narx-navo",
    },
    {
      id: 5,
      icons: () => UsersIcon(),
      link: "/user",
      text: "Ishchilar boshqaruvi",
    },
    {
      id: 7,
      icons: () => ReportBottom({}),
      link: "/m-manager/reports-hub/re-inventory",
      text: "Qayta ro'yxat",
    },
    {
      id: 6,
      icons: () => BooksIcon(),
      link: "/data-library",
      text: "Markaziy ma'lumotlar",
    },
  ],
  10: [
    {
      id: 0,
      icons: () => DataLibrary({}),
      link: "/m-manager/current-month",
      text: "Joriy oy",
    },
    {
      id: 2,
      icons: () => ReportBottom({}),
      link: "/m-manager/reports-hub",
      text: "Hisobotlar",
    },
    {
      id: 3,
      icons: () => PersonsIcons(),
      link: "/user",
      text: "Сотрудники",
    },
    {
      id: 50,
      icons: () => BellRingingIcon(),
      link: "/xabarnoma",
      text: "Xabarnomalar",
    },
  ],
  11: [
    {
      id: 1,
      icons: () => HomeIcons(),
      link: "/dashboard",
      text: "Мониторинг",
    },
    {
      id: 2,
      icons: () => StatementIcon(),
      link: "/statement",
      text: "Ведомость",
      items: [
        {
          id: 22,
          link: "/statement",
          text: "Ведомость",
        },
        {
          id: 25,
          link: "/statement/report-seller",
          text: "Отчёт по сотрудикам",
        },
      ],
    },
    {
      id: 3,
      icons: () => PersonsIcons(),
      link: "/user",
      text: "Сотрудники",
    },
    {
      id: 4,
      icons: () => HikVision(),
      link: "/hik-vision",
      text: "Hik Vision",
    },
    {
      id: 5,
      icons: () => PriceIcons({ width: 28, height: 28 }),
      link: "/awards",
      text: "Премии",
    },
    {
      id: 6,
      icons: () => DiamondIcon(),
      link: "/bonus",
      text: "Бонусы",
    },
  ],
  12: [
    {
      id: 2,
      icons: () => ReportBottom({}),
      link: "/m-manager/report",
      text: "Отчеты",
      items: [
        {
          id: 22,
          link: "/m-manager/reports",
          text: "Кассовый учёт",
        },
        {
          id: 23,
          link: "/m-manager/report-finance",
          text: "Финансовый учёт",
        },
        {
          id: 24,
          link: "/m-manager/report-remaider",
          text: "Отчет об остатке",
        },
        {
          id: 25,
          link: "/m-manager/report-seller",
          text: "Отчёт по сотрудикам",
        },
        {
          id: 26,
          link: "/m-manager/report-orginal",
          text: "Хисобот",
        },

      ],
    },
    {
      id: 33,
      icons: () => PartiesIcons(),
      link: "/parties",
      text: "Партии",
    },
    {
      id: 4,
      icons: () => UfoBottom(),
      link: "/dealer",
      text: "Дилеры",
    },
    {
      id: 2,
      icons: () => ProductIcons(),
      link: "/products",
      text: "Продукты в продаже",
    },
    {
      id: 42,
      icons: () => PriceIcons({}),
      link: "/price",
      text: "Цени и скидки",
    },
    {
      id: 50,
      icons: () => BellRingingIcon(),
      link: "/xabarnoma",
      text: "Xabarnomalar",
    },
  ]
};
