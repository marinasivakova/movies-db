import React from "react";
import qs from "qs";
import debounce from "lodash/debounce";
import { Select } from "antd";

const SearchBar = (props) => {
  const handleSearch = (newValue) => {
    const str = qs.stringify({
      query: newValue,
    });
    props.onSearch(1,str);
  };

  const handleChange = (newValue) => {
    if (newValue.target.value) {
      handleSearch(newValue.target.value);
      newValue.target.value = "";
    }
  };

  return (
    <div className="search-bar__holder">
      <Select
        className="search-bar"
        showSearch
        placeholder={props.placeholder}
        onInput={debounce(handleChange, 1500)}
        notFoundContent={null}
      />
    </div>
  );
};
export default SearchBar;
