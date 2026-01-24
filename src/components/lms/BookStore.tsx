import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderForm } from './OrderForm';
import { ShoppingCart, Book } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  isPreOrder?: boolean;
}

const books: BookItem[] = [
  {
    id: '1',
    title: 'তাজবীদ শিক্ষা',
    author: 'মাওলানা কেফায়াতুল্লাহ',
    price: 250,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80',
  },
  {
    id: '2',
    title: 'কায়দা নূরানী',
    author: 'হাফেজ নূর মুহাম্মদ',
    price: 150,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80',
  },
  {
    id: '3',
    title: 'পারা আম্মা',
    author: 'দারুল কুরআন',
    price: 180,
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&q=80',
  },
  {
    id: '4',
    title: 'সীরাতুন নবী (সা:)',
    author: 'আল্লামা সফিউর রহমান',
    price: 450,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80',
    isPreOrder: true,
  },
];

export function BookStore() {
  const { t, language } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const formatPrice = (price: number) => {
    if (language === 'bn') {
      return `৳${price}`;
    }
    return `৳${price}`;
  };

  const handleOrder = (book: BookItem) => {
    setSelectedBook(book);
    setShowOrderForm(true);
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Book className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('lms.books')}
            </h2>
          </div>
          <p className="text-muted-foreground">
            কুরআন শিক্ষার জন্য প্রয়োজনীয় বইসমূহ
          </p>
        </motion.div>

        {/* Mobile: Horizontal Scroll | Desktop: Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[260px] md:min-w-0"
            >
              <Card className="card-elevated h-full overflow-hidden group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {book.isPreOrder && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-golden text-white text-xs font-semibold rounded">
                      প্রি-অর্ডার
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {book.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(book.price)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleOrder(book)}
                      className="btn-golden text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {t('lms.order')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Form */}
        <AnimatePresence>
          {showOrderForm && selectedBook && (
            <OrderForm
              book={selectedBook}
              onClose={() => {
                setShowOrderForm(false);
                setSelectedBook(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
