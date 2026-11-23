ШРИФТЫ САЙТА. КАК ДОБАВИТЬ ФАЙЛЫ
================================
Сайт берёт шрифты Onest (заголовки) и Golos Text (текст) из этой папки, а не с серверов Google.
Пока файлов нет, сайт работает на запасных шрифтах (Segoe UI / Arial), ничего не ломается.

Нужны 2 файла:
  onest.woff2        (или onest.ttf)
  golos-text.woff2   (или golos-text.ttf)

Откуда взять (бесплатно, лицензия SIL OFL, можно хранить у себя):
  1. fonts.google.com, найти «Onest», нажать «Get font» -> «Download all».
     Из архива взять файл Onest-VariableFont_wght.ttf, переименовать в onest.ttf.
  2. То же для «Golos Text»: GolosText-VariableFont_wght.ttf -> golos-text.ttf.
  3. Положить оба файла в эту папку (assets/fonts).
  (Необязательно: перевести .ttf в .woff2 на любом онлайн-конвертере, файл станет примерно вдвое легче.
   Тогда назвать onest.woff2 и golos-text.woff2.)

Проверка: открыть сайт, в браузере нажать F12 -> вкладка Network -> обновить страницу.
Не должно быть запросов к fonts.googleapis.com и fonts.gstatic.com. Файлы шрифтов грузятся из /assets/fonts/.
