import React, { Component } from "react";
import {format, parseISO} from 'date-fns';
export default class Movie extends Component {
  render() {
    let {
      overview: desc,
      original_title: title,
      poster_path: posterUrl,
      release_date: releaseDate,
      genreNames, widenDesc
    } = this.props;

    let genreJSX  = genreNames.map((genre) => {
      return (<div className="genres__genre" key={genre}>{genre}</div>)
    })

    if (posterUrl) {
      posterUrl = "https://image.tmdb.org/t/p/original" + posterUrl;
    } else {
      posterUrl = "https://placehold.co/183x281";
    }

    if (releaseDate) {
        releaseDate = format(parseISO(releaseDate), 'MMMM d, y')
    } else {
        releaseDate = "Unknown release date"
    } 
    if (!desc) {
        desc = "No description was provided"
    }

    const openDesc = (e) => {
      if (e.target.style.overflow === "hidden" || (!e.target.style.overflow)) {
        e.target.style.overflow = "initial"
      } else {
        e.target.style.overflow = "hidden"
      }
    }

    return (
      <div className="film" onClick={widenDesc}>
        <img src={posterUrl} alt="Poster for the movie" className="film__poster" />
        <div className="film__overview" onClick={openDesc}>
          <span className="film__title">{title}</span>
          <span className="film__release">{releaseDate}</span>
          <div className="film__genres">{genreJSX}</div>
          <p className="film__description">{desc}</p>
        </div>
      </div>
    );
  }
}
