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

const imageModules = import.meta.glob('../assets/categories/*/*.{jpg,jpeg,png}', { eager: true });

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
  const baseName = item.fileName.replace(/\.(jpe?g|png)$/i, '');
  const name = baseName.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
  const price = 120 + ((index % 16) * 15);

  return {
    id: `${category.slug}-${index}`,
    name,
    category: category.name,
    slug: category.slug,
    price,
    image: item.image,
    description: `Premium ${category.name.toLowerCase()} with a rich scent profile built for modern luxury.`,
    available: true
  };
});

const featuredProducts = products.slice(0, 12);

export { categoryFolders, products, featuredProducts };
