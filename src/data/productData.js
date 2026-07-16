const categoryFolders = [
  {
    slug: 'body-sprays',
    name: 'Body Sprays',
    folder: 'Category1',
    description: 'Light, refreshing formulas made for everyday impact.'
  },
  {
    slug: 'perfume-oils',
    name: 'Perfume Oils',
    folder: 'Category2',
    description: 'Concentrated oils designed for long-lasting luxury.'
  },
  {
    slug: 'long-lasting-sprays',
    name: 'Long Lasting Sprays',
    folder: 'Category3',
    description: 'Bold scents that linger beautifully from morning to night.'
  },
  {
    slug: 'normal-sprays',
    name: 'Normal Sprays',
    folder: 'Category4',
    description: 'Everyday favorites with approachable fragrance profiles.'
  }
];

const heroImageModules = import.meta.glob('../assets/landing/*.{jpg,jpeg,png}', { eager: true });
const imageModules = import.meta.glob('../assets/categories/*/*.{jpg,jpeg,png}', { eager: true });

const formatDisplayName = (fileName) => {
  const baseName = fileName.replace(/\.(jpe?g|png)$/i, '');
  return baseName
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => (word.length > 1 ? `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}` : word.toUpperCase()))
    .join(' ');
};

const heroImageEntries = Object.entries(heroImageModules)
  .map(([path, module]) => {
    const fileName = path.split('/').pop();
    return {
      fileName,
      image: module.default
    };
  })
  .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true, sensitivity: 'base' }));

const imageEntries = Object.entries(imageModules)
  .map(([path, module]) => {
    const parts = path.split('/');
    const fileName = parts.pop();
    const folder = parts.pop();
    return {
      folder,
      fileName,
      image: module.default
    };
  })
  .sort((a, b) => {
    if (a.folder !== b.folder) {
      return a.folder.localeCompare(b.folder);
    }
    return a.fileName.localeCompare(b.fileName, undefined, { numeric: true, sensitivity: 'base' });
  });

const products = imageEntries.map((item, index) => {
  const category = categoryFolders.find((cat) => cat.folder === item.folder) || categoryFolders[0];
  const name = formatDisplayName(item.fileName);
  const price = 120 + ((index % 16) * 15);

  return {
    id: `${category.slug}-${index}`,
    name,
    category: category.name,
    slug: category.slug,
    price,
    image: item.image,
    description: `Premium ${category.name.toLowerCase()} with a rich scent profile built for modern luxury.`,
    available: true,
    stock: 10,
    lowStockThreshold: 3,
    trackInventory: true,
    archived: false
  };
});

const featuredProducts = products.slice(0, 12);

const heroSlides = heroImageEntries.map((item, index) => {
  const name = formatDisplayName(item.fileName);
  return {
    id: `hero-${index}`,
    name,
    category: 'Featured Fragrance',
    description: `Discover our premium ${name} collection.`,
    buttonLabel: 'Discover Collection',
    image: item.image,
    link: '/menu'
  };
});

export { categoryFolders, products, featuredProducts, heroSlides };
