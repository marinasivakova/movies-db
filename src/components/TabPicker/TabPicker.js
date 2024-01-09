import { Component } from "react";
import { Tabs } from "antd";

export default class TabPicker extends Component {
  render() {
    const items = [
      {
        key: "Search",
        label: "Search",
     },
      {
        key: "Rated",
        label: "Rated",
      },
    ];
    return (
      <div className="tab-picker">
        <Tabs
          centered
          defaultActiveKey="1"
          items={items}
          onChange={this.props.onPress}
        />
      </div>
    );
  }
}
