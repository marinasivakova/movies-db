import axios from "axios";

const getDataFromAPI = (tab, page, inputValue) => {
  const apiKey = "969a9d21394ad781ff1397c9618d7033";
  const client = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjlhOWQyMTM5NGFkNzgxZmYxMzk3Yzk2MThkNzAzMyIsInN1YiI6IjY1NzZmMjlhYTFkMzMyMDBjNGM3NmFmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RnzdPYPaFX6GCcfrnEdTUS6hwRAJlMlotnBY6VCkfr4",
    },
  });
  if (!document.cookie) {
    return client.get("authentication/guest_session/new").then((res) => {
      document.cookie =
        `guest_session_id=` +
        res.data.guest_session_id +
        `; expires=` +
        res.data.expires_at;
    }).catch((err)=>{
      console.log(err)
    });
  }
  let session = document.cookie.match(/=(.*)/gm).map(function (s) {
    return s.slice(1);
  });
  if (tab === "rated") {
    return axios
      .get(
        `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=${apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`,
        {
          headers: {
            accept: "application/json",
          },
        }
      )
      .then((d) => {
        const { data } = d;
        return data.results;
      }).catch((err)=>{
        console.log(err)
      });
  } else if (tab === "genres") {
    const genresUrl = "/genre/movie/list?language=en";
    return client(genresUrl).then((res) => {
      return res.data.genres;
    });
  } else if (tab === "rate") {
    return axios
      .post(
        `https://api.themoviedb.org/3/movie/${inputValue}/rating?api_key=${apiKey}&guest_session_id=${session}`,
        {
          value: page,
        }
      ).catch((err)=>{
        console.log(err)
      })
  } else {
    if (inputValue) {
      return client
        .get(
          `/search/movie?${inputValue}&include_adult=false&language=en-US&page=${page}`
        )
        .then((d) => {
          const { data } = d;
          return data.results;
        }).catch((err)=>{
          console.log(err)
        });
    }
  }
};

export default getDataFromAPI;
