import { Fragment } from "react";
import RatedTab from "../RatedTab/RatedTab";
import SearchTab from "../SearchTab/SearchTab";
import TabPicker from "../TabPicker/TabPicker";

const DefaultTab = ({
  tab,
  page,
  moviesData,
  networkConnection,
  changePage,
  ratedData,
  ratedPage,
  switchTab
}) => {
  switch (tab) {
    case "Rated":
      return (
        <Fragment>
          <TabPicker onPress={switchTab} />
          <RatedTab
            page={ratedPage}
            moviesData={ratedData}
            networkConnection={networkConnection}
            changePage={changePage}
          />
        </Fragment>
      );
      default:
        return (
          <Fragment>
            <TabPicker onPress={switchTab} />
            <SearchTab
              page={page}
              moviesData={moviesData}
              networkConnection={networkConnection}
              changePage={changePage}
              ratedData={ratedData}
            />
          </Fragment>
        );
  }
};

export default DefaultTab;
