import React, { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import MoviesList from "./components/MoviesList";
import Loader from "./components/Loader";
import ErrorHandler from "./components/ErrorHandler";

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
  client(genresUrl)
    .then((res) => {
      storage.setItem("genres", JSON.stringify(res.data.genres));
      if (this !== undefined) {
        this.setState({
          genres: JSON.parse(storage.getItem("genres")),
        });
      }
    })
    .catch((err) => {
      this.setState({
        error: err,
      });
    });
}

class App extends Component {
  state = {
    isLoaded: false,
    moviesData: [],
    networkConnection: true,
  };

  componentDidMount() {
    window.addEventListener("offline", () => {
      this.setState({ networkConnection: false });
    });
    window.addEventListener("online", () => {
      this.setState({ networkConnection: true });
    });
    client
      .get(url)
      .then((res) => {
        this.setState({
          isLoaded: true,
          moviesData: res.data.results,
        });
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
      });
  }

  render() {
    const { isLoaded, moviesData, error, networkConnection } = this.state;
    console.log(networkConnection);
    if (error) {
      return <ErrorHandler e={error} />;
    } else if (!isLoaded) {
      return <Loader />;
    } else {
      if (networkConnection) {
        return (
          <div className="app">
            <MoviesList
              data={moviesData}
              genres={JSON.parse(storage.getItem("genres"))}
            />
          </div>
        );
      } else {
        return (
          <div className="app">
            <ErrorHandler
              e={{
                code: "It seems you are currently experiencing network issues and is thus unable to connect to the Movies-DB app. Please try again later!",
                message: "Network Error",
              }}
            />
            <MoviesList
              data={moviesData}
              genres={JSON.parse(storage.getItem("genres"))}
            />
          </div>
        );
      }
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
