import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paperclip, Send } from 'lucide-react';

export const CustomOrderPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-toda-blue/10">
          <CardHeader className="text-center bg-slate-50 p-8 rounded-t-lg">
            <CardTitle className="h2 text-toda-blue">{t('customOrder.title')}</CardTitle>
            <CardDescription className="body-lg text-slate-600 mt-2">{t('customOrder.description')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="project-name" className="text-lg font-semibold">{t('customOrder.projectName')}</Label>
                  <Input id="project-name" placeholder={t('customOrder.projectNamePlaceholder')} className="h-12" />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-lg font-semibold">{t('customOrder.category')}</Label>
                  <Select>
                    <SelectTrigger id="category" className="h-12">
                      <SelectValue placeholder={t('customOrder.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="architecture">{t('customOrder.architecture')}</SelectItem>
                      <SelectItem value="interior-design">{t('customOrder.interiorDesign')}</SelectItem>
                      <SelectItem value="landscape">{t('customOrder.landscape')}</SelectItem>
                      <SelectItem value="structural">{t('customOrder.structural')}</SelectItem>
                      <SelectItem value="other">{t('customOrder.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="project-description" className="text-lg font-semibold">{t('customOrder.projectDescription')}</Label>
                <Textarea id="project-description" placeholder={t('customOrder.projectDescriptionPlaceholder')} rows={8} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-lg font-semibold">{t('customOrder.budget')}</Label>
                  <Input id="budget" type="number" placeholder={t('customOrder.budgetPlaceholder')} className="h-12" />
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-lg font-semibold">{t('customOrder.deadline')}</Label>
                  <Input id="deadline" type="date" className="h-12" />
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold">{t('customOrder.attachments')}</Label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-10 text-center hover:border-toda-blue transition-colors">
                  <Input 
                    id="attachments-upload" 
                    type="file" 
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Paperclip className="h-8 w-8 text-slate-400" />
                    <Label htmlFor="attachments-upload" className="text-primary font-semibold cursor-pointer">
                      {t('mint.chooseFile')}
                    </Label>
                    <p className="caption text-slate-500">{t('customOrder.attachmentsDescription')}</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-right pt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto bg-toda-red hover:bg-toda-red/90">
                  <Send className="w-5 h-5 mr-2" />
                  {t('customOrder.submitRequest')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
