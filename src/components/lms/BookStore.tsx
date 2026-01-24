import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderForm } from './OrderForm';
import { ShoppingCart, Book } from 'lucide-react';
import bookQuranDinShikkha from '@/assets/book-quran-din-shikkha.png';
import book21Ghontay from '@/assets/book-21-ghontay.png';

interface BookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
  isPreOrder?: boolean;
}

const books: BookItem[] = [
  {
    id: '1',
    title: 'নূরানি পদ্দতিতে পবিত্র কুরআন ও দ্বীন শিক্ষা',
    author: 'হযরত মাওলানা কেফায়াতুল্লাহ',
    price: 250,
    image: bookQuranDinShikkha,
  },
  {
    id: '2',
    title: '২১ ঘন্টায় নুরানি পদ্দবতিতে পবিত্র কুরআন শিক্ষা',
    author: 'হযরত মাওলানা কেফায়াতুল্লাহ',
    price: 180,
    image: book21Ghontay,
  },
];

export function BookStore() {
  const { t } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const orderFormRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return `৳${price}`;
  };

  const handleOrder = (book: BookItem) => {
    setSelectedBook(book);
    setShowOrderForm(true);
  };

  // Scroll to order form when it opens
  useEffect(() => {
    if (showOrderForm && orderFormRef.current) {
      setTimeout(() => {
        orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [showOrderForm]);

  return (
    <section id="book-store" className="py-16 bg-secondary/30">
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

        {/* Two Books Grid - Centered */}
        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-3xl mx-auto">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="w-full md:w-1/2"
            >
              <Card className="card-elevated h-full overflow-hidden group">
                {/* Book Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-golden/10">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Book className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                  {book.isPreOrder && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-golden text-white text-xs font-semibold rounded">
                      প্রি-অর্ডার
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[48px]">
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
        <div ref={orderFormRef}>
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
      </div>
    </section>
  );
}
