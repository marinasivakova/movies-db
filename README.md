Movies App - movies-db-puce.vercel.app

Исправления:

1. Постраничный вывод работает для запроса return - т.е. если ввести "main" и перейти на сторую страницу выведутся фильмы со второй страницы при поиске по return - исправлено, постраничный просмотр работает
2. Для оценённых фильмов постраничный вывод так же должен работать - исправлено
3. Жанры нужно передавать через контекст - они передается через контекст если я правильно понимаю это условие:
  index.js
export const ContextGenres = React.createContext([]);
...
<ContextGenres.Provider value={genres}>
              ...
              <SearchTab
               ...
              />
            </ContextGenres.Provider>
...
<ContextGenres.Provider value={genres}>
              ...
              <RatedTab
                ...
              />
            </ContextGenres.Provider>
  movie.js
import { ContextGenres } from "../..";
...
getGenres = () => {
    let genres = ContextGenres._currentValue;
    ...
        return (
          <div className="genres__genre" key={genre}>
            {genre}
          </div>
        );
};
5. Рейтинг для оценённых фильмов не сохраняется. Если оценить фильм, переключиться на оценённые фильмы и обратно - рейтинг пропадает - исправлено
6. Работу с сервером нужно вынести в отдельную директорию, в отдельный файл, чтобы потом переиспользовать эти методы - Связь с сервером вынесен в TMDB компонент
7. Для чего в карточке фильма изображение, дату и описание хранить в state? - Ненужные стейты были удалены, оставила рейтинг для обновления звезд
8. Стили компонента лучше помещать вместе с ним в одну директорию - вынесла стили в директории
