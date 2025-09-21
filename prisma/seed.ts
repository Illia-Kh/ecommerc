import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default category
  const category = await prisma.category.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      slug: 'default',
      titleCs: 'Výchozí kategorie',
      titleUk: 'Типова категорія',
      isActive: true,
    },
  });

  console.log('✅ Created category:', category.titleCs);

  // Create 12 demo products
  const products = [
    {
      slug: 'premium-headphones',
      titleCs: 'Prémiová sluchátka',
      titleUk: 'Преміальні навушники',
      descriptionCs: 'Vysoká kvalita, bezdrátová, s redukcí šumu',
      descriptionUk: 'Висока якість, бездротові, з зменшенням шуму',
      priceCZK: 1990,
      stock: 15,
      images: ['https://picsum.photos/800/600?random=1'],
    },
    {
      slug: 'smartphone-case',
      titleCs: 'Ochranné pouzdro na telefon',
      titleUk: 'Захисний чохол для телефону',
      descriptionCs: 'Odolné silikonové pouzdro s vyříznutím pro fotoaparát',
      descriptionUk: 'Міцний силіконовий чохол з вирізом для камери',
      priceCZK: 590,
      stock: 25,
      images: ['https://picsum.photos/800/600?random=2'],
    },
    {
      slug: 'wireless-charger',
      titleCs: 'Bezdrátová nabíječka',
      titleUk: 'Бездротовий зарядний пристрій',
      descriptionCs: 'Rychlé bezdrátové nabíjení pro všechny kompatibilní zařízení',
      descriptionUk: 'Швидка бездротова зарядка для всіх сумісних пристроїв',
      priceCZK: 790,
      stock: 12,
      images: ['https://picsum.photos/800/600?random=3'],
    },
    {
      slug: 'bluetooth-speaker',
      titleCs: 'Bluetooth reproduktor',
      titleUk: 'Bluetooth динамік',
      descriptionCs: 'Přenosný reproduktor s výbornou kvalitou zvuku',
      descriptionUk: 'Портативний динамік з відмінною якістю звуку',
      priceCZK: 1290,
      stock: 8,
      images: ['https://picsum.photos/800/600?random=4'],
    },
    {
      slug: 'gaming-mouse',
      titleCs: 'Herní myš',
      titleUk: 'Ігрова миша',
      descriptionCs: 'Vysokopřesné senzory, LED podsvícení, ergonomický design',
      descriptionUk: 'Високоточні сенсори, LED підсвічування, ергономічний дизайн',
      priceCZK: 990,
      stock: 18,
      images: ['https://picsum.photos/800/600?random=5'],
    },
    {
      slug: 'usb-hub',
      titleCs: 'USB hub',
      titleUk: 'USB хаб',
      descriptionCs: '7 portů, USB 3.0, kompaktní design',
      descriptionUk: '7 портів, USB 3.0, компактний дизайн',
      priceCZK: 690,
      stock: 20,
      images: ['https://picsum.photos/800/600?random=6'],
    },
    {
      slug: 'laptop-stand',
      titleCs: 'Stojan na notebook',
      titleUk: 'Підставка для ноутбука',
      descriptionCs: 'Nastavitelná výška, lepší ergonomie práce',
      descriptionUk: 'Регульована висота, краща ергономіка роботи',
      priceCZK: 1190,
      stock: 10,
      images: ['https://picsum.photos/800/600?random=7'],
    },
    {
      slug: 'webcam-hd',
      titleCs: 'HD webkamera',
      titleUk: 'HD веб-камера',
      descriptionCs: '1080p rozlišení, automatické zaostření, integrovaný mikrofon',
      descriptionUk: 'Роздільність 1080p, автофокус, вбудований мікрофон',
      priceCZK: 1590,
      stock: 14,
      images: ['https://picsum.photos/800/600?random=8'],
    },
    {
      slug: 'power-bank',
      titleCs: 'Powerbank',
      titleUk: 'Павербанк',
      descriptionCs: '10000mAh, rychlé nabíjení, dva výstupní porty',
      descriptionUk: '10000mAh, швидка зарядка, два вихідні порти',
      priceCZK: 890,
      stock: 22,
      images: ['https://picsum.photos/800/600?random=9'],
    },
    {
      slug: 'monitor-mount',
      titleCs: 'Držák na monitor',
      titleUk: 'Кріплення для монітора',
      descriptionCs: 'Nastavitelné rameno, až 27 palců, ergonomické polohování',
      descriptionUk: 'Регульоване плече, до 27 дюймів, ергономічне позиціювання',
      priceCZK: 1490,
      stock: 7,
      images: ['https://picsum.photos/800/600?random=10'],
    },
    {
      slug: 'keyboard-mechanical',
      titleCs: 'Mechanická klávesnice',
      titleUk: 'Механічна клавіатура',
      descriptionCs: 'Cherry MX přepínače, RGB podsvícení, programovatelné makro',
      descriptionUk: 'Перемикачі Cherry MX, RGB підсвічування, програмовані макроси',
      priceCZK: 2490,
      stock: 11,
      images: ['https://picsum.photos/800/600?random=11'],
    },
    {
      slug: 'desk-lamp',
      titleCs: 'Stolní lampa',
      titleUk: 'Настільна лампа',
      descriptionCs: 'LED osvětlení, nastavitelná teplota barvy, USB nabíjení',
      descriptionUk: 'LED освітлення, регульована температура кольору, USB зарядка',
      priceCZK: 1790,
      stock: 13,
      images: ['https://picsum.photos/800/600?random=12'],
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: category.id,
      },
    });
    console.log('✅ Created product:', product.titleCs);
  }

  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });