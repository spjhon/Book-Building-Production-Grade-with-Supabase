'use client';


import { useLocale } from 'next-intl';
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTransition } from "react";

type Props = {
  // Nota: Al usar cookies, no necesitas que sea obligatoriamente un Promise, 
  // pero mantengo tu estructura por compatibilidad.
  changeLocaleAction: (locale: string) => Promise<void>;
};

const locales = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' }
];

export default function LocaleSwitcher({ changeLocaleAction }: Props) {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (newLocale: string) => {
    startTransition(async () => {
      await changeLocaleAction(newLocale);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 w-auto px-3 gap-2 border-gray-200 hover:bg-gray-50 transition-colors"
          disabled={isPending}
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{currentLocale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32.5">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.id}
            onClick={() => handleSelect(loc.id)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              currentLocale === loc.id && "bg-accent font-semibold"
            )}
          >
            {loc.label}
            {currentLocale === loc.id && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}













/** 
import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import {locales} from '@/config';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {locales.map((cur) => (
        <option key={cur} value={cur} className="dark:text-black">
          {t('locale', {locale: cur})}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}*/