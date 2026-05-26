import chanelImage from '../assets/landing/chanel.jpg';
import blueSeduction from '../assets/landing/blue-seduction.jpg';
import lattafaAsad from '../assets/landing/lattafa-asad.jpg';
import elegantPerfume from '../assets/landing/elegant-perfume.jpg';
import rayhaanNocturno from '../assets/landing/rayhaan-nocturno.jpg';

export const categories = [
  {
    slug: 'body-sprays',
    name: 'Body Sprays',
    description: 'Light, refreshing and perfect for everyday use.',
  },
  {
    slug: 'perfume-oils',
    name: 'Perfume Oils',
    description: 'Luxury oils designed for lasting glow and softness.',
  },
  {
    slug: 'long-lasting-sprays',
    name: 'Long Lasting Sprays',
    description: 'Premium scents that stay with you from dawn to dusk.',
  },
  {
    slug: 'normal-sprays',
    name: 'Normal Sprays',
    description: 'Everyday favorites for confidence and refinement.',
  },
];

export const heroSlides = [
  {
    id: 1,
    title: 'Welcome to Cianelle_Luxe Fragrances',
    subtitle: 'Exquisite scents curated for true luxury.',
    buttonLabel: 'Discover Collection',
    image: chanelImage,
    link: '/menu',
  },
  {
    id: 2,
    title: 'Premium Perfume Oils & Body Sprays',
    subtitle: 'Crafted for every mood, every moment.',
    buttonLabel: 'View Top Picks',
    image: elegantPerfume,
    link: '/menu',
  },
  {
    id: 3,
    title: 'Long-Lasting Fragrance Selection',
    subtitle: 'Experience bold scents that linger beautifully.',
    buttonLabel: 'Shop Luxury',
    image: lattafaAsad,
    link: '/menu',
  },
];

export const products = [
  {
    id: 'p1',
    name: 'Chanel Classic EDP',
    category: 'Perfume Oils',
    price: 250.0,
    image: chanelImage,
    description: 'A luxurious perfume oil with warm, elegant notes.',
  },
  {
    id: 'p2',
    name: 'Blue Seduction Spray',
    category: 'Normal Sprays',
    price: 250.0,
    image: blueSeduction,
    description: 'A masculine spray with fresh aquatic accents.',
  },
  {
    id: 'p3',
    name: 'Lattafa Asad Scent',
    category: 'Long Lasting Sprays',
    price: 650.0,
    image: lattafaAsad,
    description: 'Oriental woody fragrance for confident evenings.',
  },
  {
    id: 'p4',
    name: 'Elegant Silk Body Mist',
    category: 'Body Sprays',
    price: 120.0,
    image: elegantPerfume,
    description: 'Soft floral and powder notes designed for daily wear.',
  },
  {
    id: 'p5',
    name: 'Rayhaan Nocturno Elixir',
    category: 'Long Lasting Sprays',
    price: 320.0,
    image: rayhaanNocturno,
    description: 'Rich, charismatic scent for late night luxury.',
  },
  {
    id: 'p6',
    name: 'Signature Blend Oil',
    category: 'Perfume Oils',
    price: 180.0,
    image: elegantPerfume,
    description: 'High-impact oil blend with smooth, long-lasting warmth.',
  },
];

export const featuredProducts = [
  products[0],
  products[1],
  products[2],
  products[3],
];
