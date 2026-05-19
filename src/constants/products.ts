export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  category: string;
  img: string;
  rating: number;
  desc: string;
  eta: number;
  stock: number;
}

export const PRODUCTS: Product[] = [
  // Fish & Meat
  {
    id: 'fm1',
    name: 'Premium Borali Fish',
    price: 450,
    weight: '1kg',
    category: 'fish',
    img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300',
    rating: 4.9,
    desc: 'Freshly caught from the Brahmaputra at Barpeta Ghat.',
    eta: 25,
    stock: 10
  },
  {
    id: 'fm2',
    name: 'Local Rohu',
    price: 320,
    weight: '1kg',
    category: 'fish',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300',
    rating: 4.7,
    desc: 'Local pond-raised Rohu fish, sweet and tender.',
    eta: 30,
    stock: 15
  },
  {
    id: 'fm3',
    name: 'Fresh Chicken',
    price: 220,
    weight: '1kg',
    category: 'fish',
    img: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=300',
    rating: 4.8,
    desc: 'Fresh farm chicken, cleaned and dressed.',
    eta: 20,
    stock: 20
  },
  // Grocery
  {
    id: 'g1',
    name: 'Assam Tea Leaf',
    price: 150,
    weight: '250g',
    category: 'grocery',
    img: 'https://images.unsplash.com/photo-1544787210-2211d7c928c7?auto=format&fit=crop&q=80&w=300',
    rating: 4.9,
    desc: 'Strong Orthodox Assam Tea for the perfect morning.',
    eta: 15,
    stock: 50
  },
  {
    id: 'g2',
    name: 'Mustard Oil',
    price: 180,
    weight: '1L',
    category: 'grocery',
    img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300',
    rating: 4.6,
    desc: 'Kachhi Ghani mustard oil, essential for Assamese cooking.',
    eta: 15,
    stock: 40
  },
  // Medicines
  {
    id: 'm1',
    name: 'Paracetamol 650',
    price: 30,
    weight: '10 Tablets',
    category: 'medicines',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300',
    rating: 4.5,
    desc: 'Common pain reliever and fever reducer.',
    eta: 15,
    stock: 100
  },
  // Snacks
  {
    id: 's1',
    name: 'Assamese Pitha Box',
    price: 250,
    weight: '500g',
    category: 'snacks',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300', // Placeholder
    rating: 4.9,
    desc: 'Assorted Til Pitha and Ghila Pitha.',
    eta: 25,
    stock: 10
  }
];

export const CATEGORIES = [
  { id: 'grocery', name: 'Grocery', icon: '🥬', desc: 'Instant Items' },
  { id: 'fish', name: 'Fish & Meat', icon: '🐟', desc: 'River Fresh' },
  { id: 'medicines', name: 'Pharmacy', icon: '💊', desc: 'Emergency' },
  { id: 'tiffin', name: 'Tiffin', icon: '🍱', desc: 'Home Cooked' },
  { id: 'snacks', name: 'Snacks', icon: '🥨', desc: 'Tea Time' },
  { id: 'drinks', name: 'Drinks', icon: '🧃', desc: 'Cold & Hot' },
  { id: 'veg', name: 'Fruits & Veg', icon: '🥦', desc: 'Organic' },
  { id: 'anything', name: 'Anything', icon: '✨', desc: 'Critical needs' },
];
