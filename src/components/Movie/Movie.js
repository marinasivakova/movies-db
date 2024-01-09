import React, { Component } from "react";
import { format, parseISO } from "date-fns";
import { Rate } from "antd";
import axios from "axios";
import { ContextGenres } from "../..";
export default class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desc: this.props.overview,
      title: this.props.title,
      releaseDate: this.props.release_date,
    };
  }

  componentDidMount() {
    if (this.props.rating) {
      this.setState(()=>{
        return {
          rating: this.props.rating
        }
      })
    }

    if (!this.state.posterURL && this.props.poster_path === null) {
      this.setState(() => {
        return {
          posterURL: "https://placehold.co/183x281",
        };
      });
    } else {
      this.setState(() => {
        return {
          posterURL:
            "https://image.tmdb.org/t/p/original" + this.props.poster_path,
        };
      });
    }

    if (!this.state.releaseDate && this.state.releaseDate !== null) {
      this.setState(() => {
        return {
          textDate: "Unknown release date",
        };
      });
    } else {
      this.setState(() => {
        let newDate = format(parseISO(this.state.releaseDate), "MMMM d, y");
        return {
          textDate: newDate,
        };
      });
    }

    if (!this.state.desc) {
      this.setState(() => {
        return {
          desc: "No description was provided",
        };
      });
    }
  }

  render() {
    let { widenDesc, genre_ids } = this.props;
    let rating = "0.0";
    if (this.state.rating) {
      rating = this.state.rating;
    }
    let genres = ContextGenres._currentValue;
    let genreNames = [];
    let genreJSX = [];
    if (genre_ids.length !== 0) {
      genreNames = genre_ids.map((id) => {
        let genre = genres.find((g) => g.id === id);
        if (genre) {
          return genre.name;
        }
        return null;
      });
    }
    if (genreNames[0] !== null) {
      genreJSX = genreNames.map((genre) => {
        return (
          <div className="genres__genre" key={genre}>
            {genre}
          </div>
        );
      });
    }
    const openDesc = (e) => {
      if (e.target.style.overflow === "hidden" || !e.target.style.overflow) {
        e.target.style.overflow = "initial";
        e.target.style.height = "initial";
      } else {
        e.target.style.overflow = "hidden";
        e.target.style.height = "60px";
      }
    };

    const client = axios.create({
      baseURL: "https://api.themoviedb.org/3",
      headers: {
        accept: "application/json",
      },
    });

    const handleChange = (e) => {
      const apiKey = "969a9d21394ad781ff1397c9618d7033";
      let session = document.cookie.match(/=(.*)/gm).map(function (s) {
        return s.slice(1);
      });
      client
        .post(
          `/movie/${this.props.id}/rating?api_key=${apiKey}&guest_session_id=${session[0]}`,
          {
            value: e,
          }
        )
        .then(
          this.setState({
            rating: e,
          })
        );
    };

    const changeStyle = () => {
      if (rating < 3) {
        return "#E90000";
      } else if (rating <= 5) {
        return "#E97E00";
      } else if (rating <= 7) {
        return "#E9D100";
      } else {
        return "#66E900";
      }
    };

    return (
      <div className="film" onClick={widenDesc}>
        <img
          src={this.state.posterURL}
          alt="Poster for the movie"
          className="film__poster"
        />
        <div className="film__overview">
          <div className="film__rate-tab">
            <span className="film__title">{this.state.title}</span>
            <span
              className="film__rating"
              style={{ border: `2px solid ${changeStyle()}` }}
            >
              {rating}
            </span>
          </div>
          <span className="film__release">{this.state.textDate}</span>
          <div className="film__genres">{genreJSX}</div>
          <p className="film__description" onClick={openDesc}>
            {this.state.desc}
          </p>
        </div>
        <Rate
            className="film__stars"
            value={rating}
            count={10}
            allowHalf={true}
            onChange={handleChange}
          />
      </div>
    );
  }
}
