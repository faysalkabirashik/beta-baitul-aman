import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, toBengaliNumber } from '@/contexts/LanguageContext';
import { PlayCircle } from 'lucide-react';

interface Lecture {
  id: number;
  title: string;
  videoUrl: string;
  description: string;
}

interface VideoPlayerProps {
  lecture: Lecture;
  lectureNumber: number;
}

export function VideoPlayer({ lecture, lectureNumber }: VideoPlayerProps) {
  const { t, language } = useLanguage();

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
  };

  const videoId = getYouTubeId(lecture.videoUrl);

  return (
    <Card className="card-elevated overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground py-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <PlayCircle className="w-6 h-6" />
          {t('lms.lecture')} {language === 'bn' ? toBengaliNumber(lectureNumber) : lectureNumber}: {lecture.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={lecture.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
