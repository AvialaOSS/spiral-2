import type { CascaderOption } from "@aviala-design/spiral";

/** Region / location tree — 6 countries, up to 4 levels, mixed EN/ZH labels. */
export const regionCascaderOptions: CascaderOption[] = [
  {
    value: "cn",
    label: "China (中国)",
    children: [
      {
        value: "gd",
        label: "Guangdong Province (广东省)",
        children: [
          {
            value: "sz",
            label: "Shenzhen — Special Economic Zone (深圳经济特区)",
            children: [
              { value: "ns", label: "Nanshan District (南山区)" },
              { value: "ft", label: "Futian District (福田区)" },
              { value: "lh", label: "Luohu District (罗湖区)" },
              { value: "ba", label: "Bao'an District (宝安区)" },
            ],
          },
          { value: "gz", label: "Guangzhou (广州市)" },
          { value: "dg", label: "Dongguan (东莞市)" },
          { value: "zh", label: "Zhuhai (珠海市)" },
          { value: "fs", label: "Foshan (佛山市)" },
        ],
      },
      {
        value: "hi",
        label: "Hainan Province (海南省)",
        children: [
          { value: "hk", label: "Haikou (海口市)" },
          { value: "sy", label: "Sanya (三亚市)" },
          { value: "wc", label: "Wenchang (文昌市)" },
          { value: "qh", label: "Qionghai (琼海市)" },
        ],
      },
      {
        value: "bj",
        label: "Beijing Municipality (北京市)",
        children: [
          { value: "cy", label: "Chaoyang District (朝阳区)" },
          { value: "hd", label: "Haidian District (海淀区)" },
          { value: "xc", label: "Xicheng District (西城区)" },
          { value: "dc", label: "Dongcheng District (东城区)" },
        ],
      },
      {
        value: "sh",
        label: "Shanghai Municipality (上海市)",
        children: [
          { value: "pd", label: "Pudong New Area (浦东新区)" },
          { value: "xh", label: "Xuhui District (徐汇区)" },
          { value: "ja", label: "Jing'an District (静安区)" },
          { value: "hp", label: "Huangpu District (黄浦区)" },
        ],
      },
      {
        value: "sc",
        label: "Sichuan Province (四川省)",
        children: [
          { value: "cd", label: "Chengdu (成都市)" },
          { value: "my", label: "Mianyang (绵阳市)" },
          { value: "ls", label: "Leshan (乐山市)" },
        ],
      },
      {
        value: "nm",
        label: "Inner Mongolia Autonomous Region (内蒙古自治区)",
        children: [
          { value: "hh", label: "Hohhot (呼和浩特市)" },
          { value: "bt", label: "Baotou (包头市)" },
        ],
      },
    ],
  },
  {
    value: "us",
    label: "United States",
    children: [
      {
        value: "ca",
        label: "California",
        children: [
          { value: "sf", label: "San Francisco Bay Area" },
          { value: "la", label: "Los Angeles Metropolitan Area" },
          { value: "sd", label: "San Diego County" },
          { value: "sj", label: "San Jose — Silicon Valley" },
        ],
      },
      {
        value: "ny",
        label: "New York",
        children: [
          { value: "nyc", label: "New York City — Five Boroughs" },
          { value: "buf", label: "Buffalo — Western New York" },
          { value: "alb", label: "Albany — Capital Region" },
        ],
      },
      {
        value: "tx",
        label: "Texas",
        children: [
          { value: "hou", label: "Houston — Greater Metropolitan" },
          { value: "dal", label: "Dallas–Fort Worth Metroplex" },
          { value: "aus", label: "Austin — Travis County" },
        ],
      },
      {
        value: "wa",
        label: "Washington",
        children: [
          { value: "sea", label: "Seattle — King County" },
          { value: "spo", label: "Spokane — Eastern Washington" },
        ],
      },
    ],
  },
  {
    value: "jp",
    label: "Japan (日本)",
    children: [
      {
        value: "tk",
        label: "Tokyo Metropolis (東京都)",
        children: [
          { value: "sby", label: "Shibuya Ward (渋谷区)" },
          { value: "sng", label: "Shinjuku Ward (新宿区)" },
          { value: "mnp", label: "Minato Ward (港区)" },
        ],
      },
      {
        value: "os",
        label: "Osaka Prefecture (大阪府)",
        children: [
          { value: "osk", label: "Osaka City (大阪市)" },
          { value: "sak", label: "Sakai City (堺市)" },
        ],
      },
      {
        value: "ky",
        label: "Kyoto Prefecture (京都府)",
        children: [
          { value: "kyc", label: "Kyoto City (京都市)" },
          { value: "ujs", label: "Uji City (宇治市)" },
        ],
      },
    ],
  },
  {
    value: "uk",
    label: "United Kingdom",
    children: [
      {
        value: "eng",
        label: "England",
        children: [
          { value: "lon", label: "Greater London — City & Boroughs" },
          { value: "man", label: "Greater Manchester" },
          { value: "bhm", label: "West Midlands — Birmingham" },
        ],
      },
      {
        value: "sct",
        label: "Scotland",
        children: [
          { value: "edi", label: "Edinburgh — Lothian Region" },
          { value: "gla", label: "Glasgow — Strathclyde" },
        ],
      },
    ],
  },
  {
    value: "sg",
    label: "Singapore (新加坡)",
    children: [
      {
        value: "cr",
        label: "Central Region (中央区)",
        children: [
          { value: "dt", label: "Downtown Core (市中心)" },
          { value: "or", label: "Orchard — Retail District" },
        ],
      },
      {
        value: "er",
        label: "East Region (东区)",
        children: [
          { value: "tm", label: "Tampines (淡滨尼)" },
          { value: "bd", label: "Bedok (勿洛)" },
        ],
      },
    ],
  },
  {
    value: "au",
    label: "Australia",
    children: [
      {
        value: "nsw",
        label: "New South Wales",
        children: [
          { value: "syd", label: "Sydney — Greater Metropolitan" },
          { value: "new", label: "Newcastle — Hunter Region" },
        ],
      },
      {
        value: "vic",
        label: "Victoria",
        children: [
          { value: "mel", label: "Melbourne — Port Phillip Bay" },
          { value: "geo", label: "Geelong — Bellarine Peninsula" },
        ],
      },
    ],
  },
];

/** Product category tree — 4 top-level departments, 3 levels, many siblings. */
export const categoryCascaderOptions: CascaderOption[] = [
  {
    value: "digital",
    label: "Digital & Electronics (数码电子)",
    children: [
      {
        value: "phones",
        label: "Mobile Phones & Accessories (手机及配件)",
        children: [
          { value: "flagship", label: "Flagship Smartphones — Premium Series" },
          { value: "midrange", label: "Mid-range Phones — Best Value Picks" },
          { value: "cases", label: "Cases, Screen Protectors & Chargers" },
          { value: "wearables", label: "Smartwatches & Fitness Trackers" },
          { value: "audio", label: "Wireless Earbuds & Headphones" },
        ],
      },
      {
        value: "computers",
        label: "Computers & Peripherals (电脑及外设)",
        children: [
          { value: "laptops", label: "Laptops — Ultrabook & Gaming" },
          { value: "desktops", label: "Desktop PCs & Workstations" },
          { value: "monitors", label: "Monitors — 4K & Ultrawide Displays" },
          { value: "keyboards", label: "Mechanical Keyboards & Mice" },
        ],
      },
      {
        value: "smart-home",
        label: "Smart Home & IoT (智能家居)",
        children: [
          { value: "speakers", label: "Smart Speakers & Voice Assistants" },
          { value: "lighting", label: "Smart Lighting & Switches" },
          { value: "security", label: "Cameras, Doorbells & Sensors" },
        ],
      },
    ],
  },
  {
    value: "fashion",
    label: "Fashion & Apparel (服饰鞋包)",
    children: [
      {
        value: "womens",
        label: "Women's Clothing (女装)",
        children: [
          { value: "dresses", label: "Dresses — Casual & Formal Occasions" },
          { value: "tops", label: "Tops, Blouses & Sweaters" },
          { value: "outerwear", label: "Coats, Jackets & Blazers" },
          { value: "activewear", label: "Activewear & Yoga Sets" },
        ],
      },
      {
        value: "mens",
        label: "Men's Clothing (男装)",
        children: [
          { value: "shirts", label: "Shirts — Business & Casual" },
          { value: "pants", label: "Trousers, Jeans & Shorts" },
          { value: "suits", label: "Suits & Formal Wear" },
        ],
      },
      {
        value: "shoes",
        label: "Footwear (鞋靴)",
        children: [
          { value: "sneakers", label: "Sneakers & Running Shoes" },
          { value: "boots", label: "Boots & Ankle Boots" },
          { value: "sandals", label: "Sandals & Slides" },
        ],
      },
      {
        value: "bags",
        label: "Bags & Luggage (箱包)",
        children: [
          { value: "handbags", label: "Handbags & Crossbody Bags" },
          { value: "backpacks", label: "Backpacks & Travel Bags" },
        ],
      },
    ],
  },
  {
    value: "home",
    label: "Home & Living (家居生活)",
    children: [
      {
        value: "furniture",
        label: "Furniture (家具)",
        children: [
          { value: "sofas", label: "Sofas & Sectionals — Living Room" },
          { value: "beds", label: "Beds, Mattresses & Bed Frames" },
          { value: "desks", label: "Desks & Office Chairs" },
          { value: "storage", label: "Shelving, Cabinets & Organizers" },
        ],
      },
      {
        value: "kitchen",
        label: "Kitchen & Dining (厨房餐饮)",
        children: [
          { value: "cookware", label: "Cookware & Bakeware Sets" },
          { value: "appliances", label: "Small Kitchen Appliances" },
          { value: "tableware", label: "Tableware & Drinkware" },
        ],
      },
      {
        value: "decor",
        label: "Home Décor (家居装饰)",
        children: [
          {
            value: "lighting-decor",
            label: "Lamps, Candles & Ambient Lighting",
          },
          { value: "textiles", label: "Curtains, Rugs & Cushions" },
        ],
      },
    ],
  },
  {
    value: "food",
    label: "Food & Fresh (食品生鲜)",
    children: [
      {
        value: "snacks",
        label: "Snacks & Confectionery (休闲零食)",
        children: [
          { value: "chips", label: "Chips, Crackers & Savory Snacks" },
          { value: "candy", label: "Candy, Chocolate & Gummies" },
          { value: "nuts", label: "Nuts, Dried Fruit & Trail Mix" },
        ],
      },
      {
        value: "beverages",
        label: "Beverages (饮料)",
        children: [
          { value: "coffee-tea", label: "Coffee, Tea & Instant Drinks" },
          { value: "juice", label: "Juice, Soda & Sparkling Water" },
          { value: "dairy", label: "Milk, Yogurt & Plant-based Drinks" },
        ],
      },
      {
        value: "fresh",
        label: "Fresh Produce (生鲜)",
        children: [
          { value: "fruit", label: "Seasonal Fruit — Tropical & Imported" },
          { value: "vegetables", label: "Leafy Greens & Root Vegetables" },
          { value: "meat", label: "Meat, Poultry & Seafood" },
        ],
      },
    ],
  },
];
