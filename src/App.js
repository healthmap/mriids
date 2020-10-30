import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import About from "./containers/About";
import Team from "./containers/Team";
import * as d3 from "d3-fetch";
import {theme} from "./stylesheets/theme";
import "./App.scss";
import Logo from "./components/Logo/Logo";
import HeaderWrapper from "./components/styled-components/HeaderWrapper";
import HeaderNavWrapper from "./components/styled-components/HeaderNavWrapper";

import MapParent from "./containers/MapParent";
import EbolaChartComponent from "./containers/Chart/EbolaChartComponent";

const csvLocationPath = "csv/";
const csvExtension = ".csv";

const COUNTRIES = ["Guinea", "Liberia", "Sierra Leone"];

const INITIAL_DATE_RANGE = {
  dateRange: {
    from: new Date(2014, 9, 1),
    to: new Date(2016, 1, 20)
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: true,
      ebolaData: null,
      ebolaDataCombined: null,
      riskData: null,
      mapView: "snapshot",
      filters: {
        country: "All",
        projection: false,
        ...INITIAL_DATE_RANGE
      },
      modal: {
        show: false,
        text: "",
        title: ""
      },
      chartRangeSlider: {
        start: 0,
        end: 68
      },
      chartObject: {}
    };
  }

  componentWillMount() {
    this._importDataFromCsv();
  }

  _importDataFromCsv = async () => {
    const filePath =
      csvLocationPath +
      "healthmap_projections_updated_10_August_2018" +
      csvExtension;
    const data = await d3.csv(filePath);
    let newState = {};
    newState["ebolaData"] = this._prepareEbolaData(data);
    newState["ebolaDataCombined"] = await d3.csv(
      csvLocationPath +
        "healthmap_projections_updated_10_August_2018" +
        csvExtension
    );
    newState["riskData"] = await d3.csv(
      csvLocationPath + "weighted_flow" + csvExtension
    );

    this.setState({
      dataLoading: false,
      ...newState
    });
  };

  // This prepares the imported csv data to be saved in state.ebolaData. It splits the data by country and sets the projections into 'oneWeek', 'twoWeeks', and 'month'
  _prepareEbolaData = inputData => {
    const keys = ["y"];
    const projections = ["oneWeek", "twoWeeks", "threeWeeks", "fourWeeks"];
    const projectionsMapping = {
      oneWeek: 1,
      twoWeeks: 2,
      threeWeeks: 3,
      fourWeeks: 4
    };

    let newData = {
      Guinea: {},
      Liberia: {},
      "Sierra Leone": {}
    };

    COUNTRIES.forEach(country => {
      inputData.forEach(item => {
        newData[country][item.projection_from] = {};
        newData[country][item.projection_from]["projections"] = {};
        projections.forEach(projection => {
          newData[country][item.projection_from]["projections"][
            projection
          ] = {};
          newData[country][item.projection_from]["projections"][
            "originalValue"
          ] = parseFloat(item[country]);
          keys.forEach(key => {
            newData[country][item.projection_from]["projections"][projection][
              key
            ] = parseFloat(
              item[`${key}${projectionsMapping[projection]}.${country}`]
            );
          });
        });
        newData[country][item.projection_from]["value"] = item[country];
      });
    });
    return newData;
  };

  // This changes the dateRange in the state when the range in EbobaChartComponent is changed
  _chartRangeHandler = value => {
    let fromDate = new Date(INITIAL_DATE_RANGE.dateRange.from);
    fromDate.setDate(fromDate.getDate() + 7 * value[0]);
    let toDate = new Date(INITIAL_DATE_RANGE.dateRange.to);
    toDate.setDate(toDate.getDate() + 7 * (value[1] - 68));
    this.setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          dateRange: {
            from: fromDate,
            to: toDate
          }
        },
        chartRangeSlider: {
          start: value[0],
          end: value[1]
        }
      };
    });
  };

  // This function changes the dateRange in state when the timespan buttons in EbolaChartComponent are clicked.

  timespanChangeHandler = value => {
    if (value === "1 month") {
      this.setState(prevState => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            dateRange: {
              from: new Date(2014, 9, 1),
              to: new Date(2014, 10, 1)
            }
          },
          chartRangeSlider: {
            start: 0,
            end: 4
          }
        };
      });
    }
    if (value === "3 month") {
      this.setState(prevState => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            dateRange: {
              from: new Date(2014, 9, 1),
              to: new Date(2015, 0, 1)
            }
          },
          chartRangeSlider: {
            start: 0,
            end: 13
          }
        };
      });
    }
    if (value === "6 month") {
      this.setState(prevState => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            dateRange: {
              from: new Date(2014, 9, 1),
              to: new Date(2015, 3, 1)
            }
          },
          chartRangeSlider: {
            start: 0,
            end: 26
          }
        };
      });
    }
    if (value === "1 year") {
      this.setState(prevState => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            dateRange: {
              from: new Date(2014, 9, 1),
              to: new Date(2015, 9, 1)
            }
          },
          chartRangeSlider: {
            start: 0,
            end: 52
          }
        };
      });
    }
    if (value === "max") {
      this.setState(prevState => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            dateRange: {
              from: new Date(2014, 9, 1),
              to: new Date(2016, 1, 20)
            }
          },
          chartRangeSlider: {
            start: 0,
            end: 68
          }
        };
      });
    }
  };

  _eventReadyCallback = (Chart, event) => {
    this.setState({
      chartObject: Chart
    });
  };

  // This changes the country in this.state.filters.country
  _handleCountryChange = event => {
    let selectedCountry = event.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          country: selectedCountry
        }
      };
    });
  };

  // This toggles the projection filter in the state on/off
  _handleProjectionChange = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          projection: !prevState.filters.projection
        }
      };
    });
  };

  // This toggles between 'snapshot' and 'risk' mapView in the state
  _handleMapViewChange = view => {
    this.setState(prevState => {
      if (prevState.mapView !== view) {
        return {
          ...prevState,
          mapView: view
        };
      }
    });
  };

  render() {
	  return (
      <ThemeProvider theme={theme}>
		  <Router>
        <div className="app">
          <HeaderWrapper>
            <div>
              <Logo />
              <HeaderNavWrapper>
                <li>
                  <NavLink activeClassName="is-active" exact to="/">Outbreak</NavLink>
                </li>
                <li>
                  <NavLink activeClassName="is-active" exact to="/about">About</NavLink>
                </li>
		   <li>
                  <NavLink activeClassName="is-active" exact to="/team">Team</NavLink>
                </li>
              </HeaderNavWrapper>
            </div>
          </HeaderWrapper>

          <Switch>
            <Route exact path="/">
              <Sidebar
                stateDataFromApp={this.state}
                changeCountry={this._handleCountryChange}
              />
              <MapParent
                changeMapView={this._handleMapViewChange}
                stateDataFromApp={this.state}
              />
              {this.state.mapView === "snapshot" && (
                <EbolaChartComponent
                  eventReadyCallback={this._eventReadyCallback}
                  stateDataFromApp={this.state}
                  toggleProjectionChange={this._handleProjectionChange}
                  changeDateRange={this._changeDateRange}
                  changeChartDateRange={this._chartRangeHandler}
                  timespanChangeHandler={this.timespanChangeHandler}
                />
              )}
            </Route>
            <Route exact path="/about"><About /></Route>
            <Route exact path="/team"><Team /></Route>
          </Switch>
        </div>
      </Router>
		  </ThemeProvider>
    );
  }
}

export default App;
