export const stripLocale = (pathname: string, locale: string) => {
  if (!locale) {
    return pathname;
  }

  return pathname.replace(`/${locale}`, '');
};
