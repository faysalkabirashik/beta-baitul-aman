import { motion } from 'framer-motion';
import { useLanguage, toBengaliNumber } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, CheckCircle, List } from 'lucide-react';

interface Lecture {
  id: number;
  title: string;
  videoUrl: string;
  description: string;
  date?: string;
}

interface LecturePlaylistProps {
  lectures: Lecture[];
  currentLecture: number;
  onSelectLecture: (index: number) => void;
}

export function LecturePlaylist({ lectures, currentLecture, onSelectLecture }: LecturePlaylistProps) {
  const { language } = useLanguage();

  return (
    <Card className="card-elevated h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <List className="w-5 h-5 text-primary" />
          লেকচার তালিকা
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] lg:h-[500px]">
          <div className="space-y-1 p-4 pt-0">
            {lectures.map((lecture, index) => {
              const isActive = index === currentLecture;
              const isCompleted = index < currentLecture;

              return (
                <motion.button
                  key={lecture.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectLecture(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'bg-primary/10 hover:bg-primary/20'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-primary-foreground' : isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <PlayCircle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {language === 'bn' ? toBengaliNumber(index + 1) : index + 1}. {lecture.title}
                      </p> */}
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {lecture.title}
                      </p>

                      {lecture.date && (
                        <p className={`text-xs mt-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {lecture.date}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
