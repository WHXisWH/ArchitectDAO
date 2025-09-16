import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, GraduationCap, Heart, Mail, Building as BuildingIcon, Bot } from 'lucide-react';

// --- Mock Data ---
const designers = [
  {
    name: 'Kenji Tanaka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-e695c6edd65d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8amFwYW5lc2UlMjBtYWxlJTIwcG9ydHJhaXQ%3D',
    fallback: 'KT',
    specializationKey: 'community.designerSpecialization1',
    software: ['Revit', 'AutoCAD', 'Rhino'],
    bioKey: 'community.designerBio1',
  },
  {
    name: 'Yuki Sato',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8amFwYW5lc2UlMjBmZW1hbGUlMjBwb3J0cmFpdHxlbnwwfHwwfHww%3D',
    fallback: 'YS',
    specializationKey: 'community.designerSpecialization2',
    software: ['SketchUp', '3ds Max', 'V-Ray'],
    bioKey: 'community.designerBio2',
  },
  {
    name: 'Haruto Takahashi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8amFwYW5lc2UlMjBtYWxlJTIwcG9ydHJhaXQ%3D',
    fallback: 'HT',
    specializationKey: 'community.designerSpecialization3',
    software: ['GIS', 'AutoCAD', 'Lumion'],
    bioKey: 'community.designerBio3',
  },
];

const students = [
  {
    name: 'Mai Ito',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8amFwYW5lc2UlMjBmZW1hbGUlMjBwb3J0cmFpdHxlbnwwfHwwfHww%3D',
    fallback: 'MI',
    university: 'University of Tokyo',
    graduationYear: 2026,
    projectTitleKey: 'community.studentProjectTitle1',
    projectImage: 'https://picsum.photos/seed/studentproj1/1080/720',
    projectDescKey: 'community.studentProjectDesc1',
  },
  {
    name: 'Ren Suzuki',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194d6b4a0d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8amFwYW5lc2UlMjBtYWxlJTIwcG9ydHJhaXQ%3D',
    fallback: 'RS',
    university: 'Kyoto Institute of Technology',
    graduationYear: 2025,
    projectTitleKey: 'community.studentProjectTitle2',
    projectImage: 'https://picsum.photos/seed/studentproj2/1080/720',
    projectDescKey: 'community.studentProjectDesc2',
  },
];

const hobbyists = [
  {
    name: 'Akira Watanabe',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGphcGFuZXNlJTIwbWFsZSUyMHBvcnRyYWl0fGVufDB8fDB8fHww%3D',
    fallback: 'AW',
    creationTitleKey: 'community.hobbyistCreationTitle1',
    creationImage: 'https://picsum.photos/seed/hobbyistproj1/1080/720',
    descriptionKey: 'community.hobbyistCreationDesc1',
  },
  {
    name: 'Emi Kobayashi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGphcGFuZXNlJTIwZmVtYWxlJTIwcG9ydHJhaXQ%3D',
    fallback: 'EK',
    creationTitleKey: 'community.hobbyistCreationTitle2',
    creationImage: 'https://picsum.photos/seed/hobbyistproj2/1080/720',
    descriptionKey: 'community.hobbyistCreationDesc2',
  },
];

// --- Sub-components ---

const DesignerCard = ({ designer, t }: { designer: typeof designers[0], t: any }) => (
  <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
    <CardHeader className="flex flex-row items-start bg-slate-50 p-4">
      <Avatar className="w-16 h-16 mr-4 border-2 border-white shadow-md">
        <AvatarImage src={designer.avatar} alt={designer.name} />
        <AvatarFallback className="bg-toda-blue text-white">{designer.fallback}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle className="h5">{designer.name}</CardTitle>
        <CardDescription className="text-toda-blue font-semibold">{t(designer.specializationKey)}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="p-4 text-sm">
      <p className="text-slate-600 mb-3 min-h-[60px]">{t(designer.bioKey)}</p>
      <div className="mb-3">
        <h4 className="font-semibold text-slate-700 mb-1">{t('community.software')}</h4>
        <div className="flex flex-wrap gap-1">
          {designer.software.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
        </div>
      </div>
    </CardContent>
    <CardFooter className="bg-slate-50 p-4">
      <Button className="w-full" variant="outline"><Mail className="w-4 h-4 mr-2" /> {t('community.getInTouch')}</Button>
    </CardFooter>
  </Card>
);

const StudentCard = ({ student, t }: { student: typeof students[0], t: any }) => (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <div className="aspect-video bg-slate-200 overflow-hidden">
            <img src={student.projectImage} alt={t(student.projectTitleKey)} className="w-full h-full object-cover" />
        </div>
        <CardHeader className="p-4">
            <CardTitle className="h6">{t(student.projectTitleKey)}</CardTitle>
            <CardDescription>{t(student.projectDescKey)}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
            <div className="flex items-center text-sm text-slate-500">
                <Avatar className="w-8 h-8 mr-2 border">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback className="bg-toda-blue text-white">{student.fallback}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-slate-700">{student.name}</p>
                    <p>{student.university}, {t('community.graduationYear')} {student.graduationYear}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const HobbyistCard = ({ hobbyist, t }: { hobbyist: typeof hobbyists[0], t: any }) => (
    <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="aspect-video bg-slate-200 overflow-hidden">
            <img src={hobbyist.creationImage} alt={t(hobbyist.creationTitleKey)} className="w-full h-full object-cover" />
        </div>
        <CardContent className="p-4">
            <p className="font-semibold text-slate-800">{t(hobbyist.creationTitleKey)}</p>
            <p className="text-sm text-slate-600 mt-1">by {hobbyist.name}</p>
        </CardContent>
    </Card>
);

// --- Main Component ---

export const DAOCommunityPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12 px-6 bg-gray-50">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="h1 text-toda-blue">{t('community.title')}</h1>
        <p className="body-lg text-slate-600 mt-4">{t('community.description')}</p>
      </div>

      <Tabs defaultValue="designers" className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 h-12 shadow-md">
          <TabsTrigger value="designers" className="h-10"><Briefcase className="w-4 h-4 mr-2"/>{t('community.designers')}</TabsTrigger>
          <TabsTrigger value="students" className="h-10"><GraduationCap className="w-4 h-4 mr-2"/>{t('community.students')}</TabsTrigger>
          <TabsTrigger value="hobbyists" className="h-10"><Heart className="w-4 h-4 mr-2"/>{t('community.hobbyists')}</TabsTrigger>
        </TabsList>

        <TabsContent value="designers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designers.map(d => <DesignerCard key={d.name} designer={d} t={t} />)}
          </div>
        </TabsContent>

        <TabsContent value="students">
            <div className="text-center mb-8 p-4 bg-white rounded-lg shadow-md">
                <h3 className="h3">{t('community.studentProjects')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {students.map(s => <StudentCard key={s.name} student={s} t={t} />)}
                 <Card className="border-dashed border-2 flex flex-col items-center justify-center text-center p-8 hover:border-toda-blue transition-colors bg-white shadow-md">
                    <BuildingIcon className="w-12 h-12 text-slate-400 mb-4"/>
                    <h3 className="h6">{t('community.showcaseYourProject')}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('community.studentCallToAction')}</p>
                    <Button className="mt-4">{t('community.mintYourWork')}</Button>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="hobbyists">
            <div className="text-center mb-8 p-4 bg-white rounded-lg shadow-md">
                <h3 className="h3">{t('community.hobbyistCreations')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {hobbyists.map(h => <HobbyistCard key={h.name} hobbyist={h} t={t} />)}
                <Card className="border-dashed border-2 flex flex-col items-center justify-center text-center p-6 hover:border-toda-blue transition-colors aspect-square bg-white shadow-md">
                    <Bot className="w-10 h-10 text-slate-400 mb-3"/>
                    <h3 className="font-semibold">{t('community.shareYourCreation')}</h3>
                    <p className="caption text-slate-500 mt-1">{t('community.hobbyistCallToAction')}</p>
                    <Button variant="outline" size="sm" className="mt-3">{t('community.joinNow')}</Button>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
