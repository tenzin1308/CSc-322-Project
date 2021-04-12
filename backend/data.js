import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'admin',
      email: 'admin@futuretech.com',
      password: bcrypt.hashSync('0', 8),
      isAdmin: true,
      isSeller: true,
      seller: {
        name: '',
        logo: '/images/*.png',
        description: 'best seller',
        rating: 4.5,
        numReviews: 120,
      },
    },
  ],
  products: [
    {
      name: 'Corsair HX 750',
      category: 'Power Supply',
      image: '/images/p1.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Corsair',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
    },
  ],
};
export default data;
