import React, { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import MoviesList from "./components/MoviesList";

const url =
  "/search/movie?query=return&include_adult=false&language=en-US&page=1";
const genresUrl = "/genre/movie/list?language=en";
const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjlhOWQyMTM5NGFkNzgxZmYxMzk3Yzk2MThkNzAzMyIsInN1YiI6IjY1NzZmMjlhYTFkMzMyMDBjNGM3NmFmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RnzdPYPaFX6GCcfrnEdTUS6hwRAJlMlotnBY6VCkfr4",
  },
});

let storage = window.localStorage;
if (!storage.getItem("genres")) {
  client(genresUrl).then((res)=>{
    console.log(res)
    storage.setItem("genres", JSON.stringify(res.data.genres));
    this.setState({
      genres: JSON.parse(storage.getItem("genres")),
    });
  });
}

class App extends Component {
  state = {
    isLoaded: false,
    moviesData: [],
  };

  componentDidMount() {
       client.get(url).then((res) => {
        this.setState({
          isLoaded: true,
          moviesData: res.data.results,
        });
      });
  }

  render() {
    const { isLoaded, moviesData } = this.state;
    if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      return (
        <div className="app">
          <MoviesList
            data={moviesData}
            genres={JSON.parse(storage.getItem("genres"))}
          />
        </div>
      );
    }
  }
}

let container = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root");
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
});
