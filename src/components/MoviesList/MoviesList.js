import React, { Component } from "react";
import Movie from "../Movie/Movie";

export default class MoviesList extends Component {
  render() {
    const openDesc = (e) => {
      if (e.currentTarget.style.height === "279px" || (!e.currentTarget.style.height)) {
        e.currentTarget.style.height = "fit-content"
      } else {
        e.currentTarget.style.height = "279px";
      }
    }
    const { data, genres } = this.props;
    const films = data.map((item) => {
      const { id } = item;
      let genreNames = item.genre_ids.map((element) => {
        return genres.find((genre) => genre.id === element).name;
      });
      return (<div key={id} className="film" onClick={openDesc}>
        <Movie {...item} genreNames={genreNames}/>
      </div>);
    });
    return <div className="films">{films}</div>;
  }
}
