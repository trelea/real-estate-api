import { dataSource } from '../database';
import {
  HousingCondition,
  HousingStock,
  MultilingualEntity,
  ApartmentFeature,
  HouseFeature,
  CommercialFeature,
  CommercialDestination,
  CommercialPlacing,
  TerrainFeature,
  TerrainUsability,
  LocationCategory,
  LocationSubcategory,
} from '../database/entities';

/**
 * {
 *  ro: string;
 *  ru: string;
 *  en: string;
 * }
 */
type MainType = Omit<MultilingualEntity, 'id' | 'created_at' | 'updated_at'>;
type LocationType = MainType & { subcategories: MainType[] };

const housingStocks: MainType[] = [
  {
    ro: 'Bloc nou',
    ru: 'Новый блок',
    en: 'New block',
  },
  {
    ro: 'Bloc secundar',
    ru: 'Вторичный блок',
    en: 'Secondary block',
  },
];
const housingConditions: MainType[] = [
  {
    ro: 'Reparație euro',
    ru: 'Евроремонт',
    en: 'Euro renovation',
  },
  {
    ro: 'Reparație cosmetică',
    ru: 'Косметический ремонт',
    en: 'Cosmetic renovation',
  },
  {
    ro: 'Design individual',
    ru: 'Индивидуальный дизайн',
    en: 'Individual design',
  },
  {
    ro: 'Varianta albă',
    ru: 'Белый вариант',
    en: 'White version',
  },
  {
    ro: 'Varianta sură',
    ru: 'Серый вариант',
    en: 'Gray version',
  },
  {
    ro: 'Nefinisat',
    ru: 'Черновая отделка',
    en: 'Unfinished',
  },
];
const apartmentsFeatures: MainType[] = [
  { ro: 'Mobilată', ru: 'Меблированная', en: 'Furnished' },
  { ro: 'Cu electrocasnice', ru: 'С бытовой техникой', en: 'With appliances' },
  {
    ro: 'Încălzire autonomă',
    ru: 'Автономное отопление',
    en: 'Independent heating',
  },
  {
    ro: 'Aparat de aer condiționat',
    ru: 'Кондиционер',
    en: 'Air conditioning',
  },
  {
    ro: 'Geamuri termopan',
    ru: 'Термопанельные окна',
    en: 'Thermo-pane windows',
  },
  { ro: 'Geamuri panoramice', ru: 'Панорамные окна', en: 'Panoramic windows' },
  { ro: 'Încălzire pardosea', ru: 'Тёплый пол', en: 'Underfloor heating' },
  { ro: 'Parchet', ru: 'Паркет', en: 'Parquet flooring' },
  { ro: 'Tavane înalte', ru: 'Высокие потолки', en: 'High ceilings' },
  { ro: 'Usă blindată', ru: 'Бронированная дверь', en: 'Armored door' },
  { ro: 'Sisteme de alarmă', ru: 'Системы сигнализации', en: 'Alarm systems' },
  { ro: 'Interfon', ru: 'Домофон', en: 'Intercom' },
  {
    ro: 'Exclude etajul întâi',
    ru: 'Исключает первый этаж',
    en: 'Excludes ground floor',
  },
  {
    ro: 'Exclude ultimul etaj',
    ru: 'Исключает последний этаж',
    en: 'Excludes top floor',
  },
  {
    ro: 'Amplasare la mijloc',
    ru: 'Расположение в середине',
    en: 'Middle floor placement',
  },
  { ro: 'Ascensor', ru: 'Лифт', en: 'Elevator' },
  { ro: 'Loc de parcare', ru: 'Парковочное место', en: 'Parking space' },
  { ro: 'Gradiniță', ru: 'Детский сад', en: 'Kindergarten' },
  { ro: 'Electricitate', ru: 'Электричество', en: 'Electricity' },
  { ro: 'Gaz', ru: 'Газ', en: 'Gas' },
  { ro: 'Canalizare', ru: 'Канализация', en: 'Sewage' },
  { ro: 'Supermarket', ru: 'Супермаркет', en: 'Supermarket' },
  { ro: 'Apeduct', ru: 'Водопровод', en: 'Water supply' },
  { ro: 'Școală', ru: 'Школа', en: 'School' },
  {
    ro: 'Teren de joacă pentru copii',
    ru: 'Детская площадка',
    en: "Children's playground",
  },
  {
    ro: 'Spital / policlinică',
    ru: 'Больница / поликлиника',
    en: 'Hospital / clinic',
  },
  { ro: 'Drum asfaltat', ru: 'Асфальтированная дорога', en: 'Paved road' },
];
const housesFeatures: MainType[] = [
  // House-specific features from the images
  { ro: 'Mobilată', ru: 'Меблированная', en: 'Furnished' },
  { ro: 'Cu electrocasnice', ru: 'С бытовой техникой', en: 'With appliances' },
  {
    ro: 'Încălzire autonomă',
    ru: 'Автономное отопление',
    en: 'Independent heating',
  },
  {
    ro: 'Aparat de aer condiționat',
    ru: 'Кондиционер',
    en: 'Air conditioning',
  },
  {
    ro: 'Geamuri termopan',
    ru: 'Термопанельные окна',
    en: 'Thermo-pane windows',
  },
  { ro: 'Geamuri panoramice', ru: 'Панорамные окна', en: 'Panoramic windows' },
  { ro: 'Încălzire pardosea', ru: 'Тёплый пол', en: 'Underfloor heating' },
  { ro: 'Parchet', ru: 'Паркет', en: 'Parquet flooring' },
  { ro: 'Tavane înalte', ru: 'Высокие потолки', en: 'High ceilings' },
  { ro: 'Ușă blindată', ru: 'Бронированная дверь', en: 'Armored door' },
  { ro: 'Sisteme de alarmă', ru: 'Системы сигнализации', en: 'Alarm systems' },
  { ro: 'Interfon', ru: 'Домофон', en: 'Intercom' },
  { ro: 'Electricitate', ru: 'Электричество', en: 'Electricity' },
  { ro: 'Gaz', ru: 'Газ', en: 'Gas' },
  { ro: 'Canalizare', ru: 'Канализация', en: 'Sewage' },

  // Nearby amenities (could also be relevant for houses)
  { ro: 'Supermarket', ru: 'Супермаркет', en: 'Supermarket' },
  { ro: 'Apeduct', ru: 'Водопровод', en: 'Water supply' },
  { ro: 'Școală', ru: 'Школа', en: 'School' },
  {
    ro: 'Teren de joacă pentru copii',
    ru: 'Детская площадка',
    en: "Children's playground",
  },
  {
    ro: 'Spital / policlinică',
    ru: 'Больница / поликлиника',
    en: 'Hospital / clinic',
  },
  { ro: 'Drum asfaltat', ru: 'Асфальтированная дорога', en: 'Paved road' },

  // Features that might be more house-specific
  { ro: 'Gradiniță', ru: 'Детский сад', en: 'Kindergarten' },
  { ro: 'Loc de parcare', ru: 'Парковочное место', en: 'Parking space' },
];
const commercialsFeatures: MainType[] = [
  // Building features relevant for commercial spaces
  { ro: 'Mobilată', ru: 'Меблированная', en: 'Furnished' },
  { ro: 'Cu electrocasnice', ru: 'С бытовой техникой', en: 'With appliances' },
  {
    ro: 'Încălzire autonomă',
    ru: 'Автономное отопление',
    en: 'Independent heating',
  },
  {
    ro: 'Aparat de aer condiționat',
    ru: 'Кондиционер',
    en: 'Air conditioning',
  },
  {
    ro: 'Geamuri termopan',
    ru: 'Термопанельные окна',
    en: 'Thermo-pane windows',
  },
  { ro: 'Geamuri panoramice', ru: 'Панорамные окна', en: 'Panoramic windows' },
  { ro: 'Încălzire pardosea', ru: 'Тёплый пол', en: 'Underfloor heating' },
  { ro: 'Parchet', ru: 'Паркет', en: 'Parquet flooring' },
  { ro: 'Tavane înalte', ru: 'Высокие потолки', en: 'High ceilings' },
  { ro: 'Ușă blindată', ru: 'Бронированная дверь', en: 'Armored door' },
  { ro: 'Sisteme de alarmă', ru: 'Системы сигнализации', en: 'Alarm systems' },
  { ro: 'Interfon', ru: 'Домофон', en: 'Intercom' },
  { ro: 'Ascensor', ru: 'Лифт', en: 'Elevator' },
  { ro: 'Loc de parcare', ru: 'Парковочное место', en: 'Parking space' },
  { ro: 'Electricitate', ru: 'Электричество', en: 'Electricity' },
  { ro: 'Gaz', ru: 'Газ', en: 'Gas' },
  { ro: 'Canalizare', ru: 'Канализация', en: 'Sewage' },
  { ro: 'Apeduct', ru: 'Водопровод', en: 'Water supply' },

  // Nearby amenities important for commercial properties
  { ro: 'Supermarket', ru: 'Супермаркет', en: 'Supermarket' },
  { ro: 'Școală', ru: 'Школа', en: 'School' },
  {
    ro: 'Teren de joacă pentru copii',
    ru: 'Детская площадка',
    en: "Children's playground",
  },
  {
    ro: 'Spital / policlinică',
    ru: 'Больница / поликлиника',
    en: 'Hospital / clinic',
  },
  { ro: 'Drum asfaltat', ru: 'Асфальтированная дорога', en: 'Paved road' },

  // Commercial-specific features (though not in the images, these are common)
  { ro: 'Spațiu open-space', ru: 'Опен-спейс', en: 'Open-space' },
  { ro: 'Sala de conferințe', ru: 'Конференц-зал', en: 'Conference room' },
  { ro: 'Intrare separată', ru: 'Отдельный вход', en: 'Separate entrance' },
];
const commercialsDestinations: MainType[] = [
  {
    ro: 'Comercial',
    ru: 'Коммерческая недвижимость',
    en: 'Commercial property',
  },
  {
    ro: 'Birouri',
    ru: 'Офисы',
    en: 'Offices',
  },
  {
    ro: 'Depozit / producere',
    ru: 'Склад / производство',
    en: 'Warehouse / manufacturing',
  },
  {
    ro: 'Restaurant / bar / cafenea',
    ru: 'Ресторан / бар / кафе',
    en: 'Restaurant / bar / cafe',
  },
];
const commercialsPlacings: MainType[] = [
  {
    ro: 'Clădire separată',
    ru: 'Отдельное здание',
    en: 'Standalone building',
  },
  {
    ro: 'Colțul clădirii',
    ru: 'Угловое помещение',
    en: 'Corner unit',
  },
  {
    ro: 'Fațada laterală',
    ru: 'Боковой фасад',
    en: 'Side facade',
  },
  {
    ro: 'Amplasare centrală',
    ru: 'Центральное расположение',
    en: 'Central location',
  },
];
const terrainFeatures: MainType[] = [
  // Infrastructure features
  { ro: 'Drum asfaltat', ru: 'Асфальтированная дорога', en: 'Paved road' },
  { ro: 'Electricitate', ru: 'Электричество', en: 'Electricity' },
  { ro: 'Gaz', ru: 'Газ', en: 'Gas' },
  { ro: 'Canalizare', ru: 'Канализация', en: 'Sewage' },
  { ro: 'Apeduct', ru: 'Водопровод', en: 'Water supply' },

  // Nearby amenities
  { ro: 'Supermarket', ru: 'Супермаркет', en: 'Supermarket' },
  { ro: 'Școală', ru: 'Школа', en: 'School' },
  {
    ro: 'Teren de joacă pentru copii',
    ru: 'Детская площадка',
    en: "Children's playground",
  },
  {
    ro: 'Spital / policlinică',
    ru: 'Больница / поликлиника',
    en: 'Hospital / clinic',
  },
  { ro: 'Gradiniță', ru: 'Детский сад', en: 'Kindergarten' },

  // Terrain-specific features (though not in images, these are common)
  {
    ro: 'Acces drum public',
    ru: 'Выход к общественной дороге',
    en: 'Public road access',
  },
  { ro: 'Teren împrejmuit', ru: 'Огороженный участок', en: 'Fenced lot' },
  { ro: 'Teren nivelat', ru: 'Выровненный участок', en: 'Leveled terrain' },
];
const terrainUsabilities: MainType[] = [
  {
    ro: 'FotosinĢă și desfiinĢare terenului',
    ru: 'Фотосъемка и межевание участка',
    en: 'Aerial photography and land surveying',
  },
  {
    ro: 'ConstrucĠie',
    ru: 'Строительство',
    en: 'Construction',
  },
  {
    ro: 'Agro',
    ru: 'Сельское хозяйство',
    en: 'Agriculture',
  },
];
const locations: LocationType[] = [
  {
    ro: 'Chișinău',
    ru: 'Кишинёва',
    en: 'Chisinau',
    subcategories: [
      { ro: 'Botanica', ru: 'Ботаника', en: 'Botanica' },
      { ro: 'Buiucani', ru: 'Буюканы', en: 'Buiucani' },
      { ro: 'Ciocana', ru: 'Чокана', en: 'Ciocana' },
      { ro: 'Rășcani', ru: 'Рышканы', en: 'Rascani' },
      { ro: 'Poșta Veche', ru: 'Старая Почта', en: 'Old Post Office' },
      { ro: 'Telecentru', ru: 'Телецентр', en: 'Telecenter' },
      { ro: 'Sculeni', ru: 'Скулень', en: 'Sculeni' },
      { ro: 'Schinoasa', ru: 'Шкиноаса', en: 'Schinoasa' },
    ],
  },
  {
    ro: 'Suburbii',
    ru: 'Пригороды ',
    en: 'Suburbs',
    subcategories: [
      { ro: 'Dumbrăveni', ru: 'Думбравень', en: 'Dumbraveni' },
      { ro: 'Cricova', ru: 'Крикова', en: 'Cricova' },
      { ro: 'Codru', ru: 'Кодру', en: 'Codru' },
      { ro: 'Stăuceni', ru: 'Стэучень', en: 'Stauceni' },
      { ro: 'Colonia', ru: 'Колония', en: 'Colonia' },
      { ro: 'Clorescu', ru: 'Клореску', en: 'Clorescu' },
      { ro: 'Trușeni', ru: 'Трушень', en: 'Truseni' },
      { ro: 'Tohatin', ru: 'Тохатин', en: 'Tohatin' },
      { ro: 'Grătiești', ru: 'Грэтиешть', en: 'Gratiesti' },
      { ro: 'Vatra', ru: 'Ватра', en: 'Vatra' },
      { ro: 'Ghidighici', ru: 'Гидигич', en: 'Ghidighici' },
      { ro: 'Condrița', ru: 'Кондрица', en: 'Condrita' },
      { ro: 'Bacioi', ru: 'Бачой', en: 'Bacioi' },
      { ro: 'Danceni', ru: 'Данчень', en: 'Danceni' },
      { ro: 'Bulboci', ru: 'Булбокь', en: 'Bulboci' },
      { ro: 'Sîngera', ru: 'Сынжера', en: 'Singera' },
      { ro: 'Cruzești', ru: 'Крузешть', en: 'Cruzesti' },
      { ro: 'Vadul lui Vodă', ru: 'Вадул-луй-Водэ', en: 'Vadul lui Voda' },
      { ro: 'Huluboaia', ru: 'Хулубоайя', en: 'Huluboaia' },
      { ro: 'Humulești', ru: 'Хумулешть', en: 'Humulesti' },
      { ro: 'Bîc', ru: 'Бык', en: 'Bic' },
    ],
  },
  {
    ro: 'România',
    ru: 'Румыния',
    en: 'Romania',
    subcategories: [
      { ro: 'Brașov', ru: 'Брашов', en: 'Brasov' },
      { ro: 'Iași', ru: 'Яссы', en: 'Iasi' },
      { ro: 'București', ru: 'Бухарест', en: 'Bucharest' },
      { ro: 'Constanța', ru: 'Констанца', en: 'Constanta' },
    ],
  },
  {
    ro: 'Alte localități',
    ru: 'Другие населённые',
    en: 'Other locations',
    subcategories: [
      // Districts
      { ro: 'Ocnita', ru: 'Окница', en: 'Ocnita' },
      { ro: 'Leova', ru: 'Леова', en: 'Leova' },
      { ro: 'Rezina', ru: 'Резина', en: 'Reza' },
      { ro: 'Donduseni', ru: 'Дондюшены', en: 'Donduseni' },
      { ro: 'Taraclia', ru: 'Тараклия', en: 'Taraclia' },
      { ro: 'Soldanesti', ru: 'Солданешты', en: 'Soldanesti' },
      { ro: 'Dubasari', ru: 'Дубоссары', en: 'Dubasari' },
      { ro: 'Basarabeasca', ru: 'Басарабяска', en: 'Basarabeasca' },
      { ro: 'Vulcanesti', ru: 'Вулканешты', en: 'Vulcanesti' },

      // Cities and towns
      { ro: 'Bălți', ru: 'Бельцы', en: 'Balti' },
      { ro: 'Orhei', ru: 'Орхей', en: 'Orhei' },
      { ro: 'Cahul', ru: 'Кагул', en: 'Cahul' },
      { ro: 'Hîncești', ru: 'Хынчешты', en: 'Hincesti' },
      { ro: 'Ungheni', ru: 'Унгены', en: 'Ungheni' },
      { ro: 'Ialoveni', ru: 'Яловены', en: 'Ialoveni' },
      { ro: 'Soroca', ru: 'Сорока', en: 'Soroca' },
      { ro: 'Strășeni', ru: 'Страшены', en: 'Straseni' },
      { ro: 'Căușeni', ru: 'Кэушень', en: 'Causeni' },
      { ro: 'Fălești', ru: 'Фэлешть', en: 'Falesti' },
      { ro: 'Singerei', ru: 'Сынжерей', en: 'Singerei' },
      { ro: 'Anenii Noi', ru: 'Анений Ной', en: 'Anenii Noi' },
      { ro: 'Florești', ru: 'Флорешты', en: 'Floresti' },
      { ro: 'Drochia', ru: 'Дрокия', en: 'Drochia' },
      { ro: 'Edineț', ru: 'Единец', en: 'Edinet' },
      { ro: 'Criuleni', ru: 'Криуляны', en: 'Criuleni' },
      { ro: 'Briceni', ru: 'Бричаны', en: 'Briceni' },
      { ro: 'Călărași', ru: 'Кэлэрашь', en: 'Calarasi' },
      { ro: 'Telenești', ru: 'Теленешты', en: 'Telenesti' },
      { ro: 'Ștefan Vodă', ru: 'Штефан Водэ', en: 'Stefan Voda' },
      { ro: 'Rîșcani', ru: 'Рышканы', en: 'Riscani' },
      { ro: 'Nisporeni', ru: 'Ниспорены', en: 'Nisporeni' },
      { ro: 'Cantemir', ru: 'Кантемир', en: 'Cantemir' },
    ],
  },
];

export const seedRepository = async (entity: any, data: MainType[]) => {
  return await dataSource.transaction(async (manager) => {
    const repository = manager.getRepository(entity);

    console.log(`Seeding ${entity.name} with ${data.length} records...`);

    const insertResult = await repository
      .createQueryBuilder()
      .insert()
      .values(data as any)
      .orIgnore() // skip rows that violate unique constraints
      .execute();

    const affected = insertResult.identifiers.length;

    console.log(
      `✅ Successfully seeded ${affected} new ${entity.name} records (duplicates ignored)`,
    );
    return affected;
  });
};

const seedLocations = async () => {
  await dataSource.transaction(async (manager) => {
    const categoryRepo = manager.getRepository(LocationCategory);
    const subRepo = manager.getRepository(LocationSubcategory);

    for (const { subcategories, ...categoryData } of locations) {
      // insert-or-ignore the category
      const categoryEntity = await categoryRepo.save(
        categoryRepo.create(categoryData),
      );

      for (const sub of subcategories) {
        await subRepo
          .createQueryBuilder()
          .insert()
          .values({ ...sub, category: categoryEntity })
          .orIgnore()
          .execute();
      }
    }
  });
};

async function main() {
  try {
    console.log('🚀 Starting database seeding...');

    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Seed all entities sequentially
    await seedRepository(HousingStock, housingStocks);
    await seedRepository(HousingCondition, housingConditions);
    await seedRepository(ApartmentFeature, apartmentsFeatures);
    await seedRepository(HouseFeature, housesFeatures);
    await seedRepository(CommercialFeature, commercialsFeatures);
    await seedRepository(CommercialDestination, commercialsDestinations);
    await seedRepository(CommercialPlacing, commercialsPlacings);
    await seedRepository(TerrainFeature, terrainFeatures);
    await seedRepository(TerrainUsability, terrainUsabilities);
    await seedLocations();
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    // Close the database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('📦 Database connection closed');
    }
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
