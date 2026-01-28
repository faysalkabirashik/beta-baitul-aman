import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, toBengaliNumber } from '@/contexts/LanguageContext';
import { PlayCircle } from 'lucide-react';



interface Lecture {
  id: number;
  title: string;
  videoUrl: string;
  description: string;
  date?: string;
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

  // Convert Bangla digit to English digit
  const banglaToEnglishDigit = (digit: string) => {
    const map: Record<string, string> = {
      '০': '0',
      '১': '1',
      '২': '2',
      '৩': '3',
      '৪': '4',
      '৫': '5',
      '৬': '6',
      '৭': '7',
      '৮': '8',
      '৯': '9',
    };
    return map[digit] ?? digit;
  };

  // Extract class number from Bangla title like "কুরআন ক্লাস - ৭"
  const getClassNumberFromTitle = (title: string) => {
    const match = title.match(/-\s*([০-৯]+)/);
    if (!match) return lectureNumber.toString();

    return match[1]
      .split('')
      .map(banglaToEnglishDigit)
      .join('');
  };

  // const classNumber = getClassNumberFromTitle(lecture.title);

  return (


    <Card className="card-elevated overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground py-4">
        {/* <CardTitle className="flex items-center gap-3 text-lg"> */}
        {/* <PlayCircle className="w-6 h-6" /> */}
        {/* {t('lms.lecture')} {language === 'bn' ? toBengaliNumber(lectureNumber) : lectureNumber}: {lecture.title} */}
        {/* {t('lms.lecture')} {language === 'bn' ? toBengaliNumber(lectureNumber) : lectureNumber}: {lecture.title} */}
        {/* {lecture.date && ` (${lecture.date})`} */}
        {/* </CardTitle> */}

        {/* <CardTitle className="flex items-center gap-3 text-lg">
          <PlayCircle className="w-6 h-6" />
          {t('lms.lecture')} {language === 'bn' ? toBengaliNumber(lectureNumber) : lectureNumber}: {lecture.title}
          {lecture.date && ` (${lecture.date})`}
        </CardTitle> */}
        <CardTitle className="flex items-center gap-3 text-lg">
          <PlayCircle className="w-6 h-6" />
          {t('lms.lecture')}{' '}
          {language === 'bn'
            ? toBengaliNumber(getClassNumberFromTitle(lecture.title))
            : getClassNumberFromTitle(lecture.title)
          }:
          {' '}
          {lecture.title}
          {lecture.date && ` (${lecture.date})`}
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
