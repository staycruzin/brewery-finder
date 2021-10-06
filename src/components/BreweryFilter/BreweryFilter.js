import { useEffect, useState } from 'react';
import './BreweryFilter.css';

// Filter out US territories from the list of states
const stateFilter = (state) => {
  const { iso2 } = state;

  const isoCodesToExclude = ['AS', 'DC', 'GU', 'MP', 'PR', 'VI'];
  if (iso2.startsWith('UM') || isoCodesToExclude.includes(iso2)) {
    return false;
  }

  return true;
}

// Check the response status of API calls and handle accordingly
const checkFetchError = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(response.statusText);
};

const BreweryFilter = ({ setFilter }) => {
  const [states, setStates] = useState({
    list: [],
    selectedState: 'default',
    isFetchError: false,
  })
  const [cities, setCities] = useState({
    list: [],
    selectedCity: 'default',
    isFetchError: false,
  });
  const [breweries, setBreweries] = useState({
    list: [],
    displayType: 'Random',
    isFetchError: false,
  });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Fetch the list of states when the component mounts
    const fetchStates = () => {
      const headers = new Headers();
      headers.append("X-CSCAPI-KEY", process.env.REACT_APP_COUNTRY_STATE_CITY_API_KEY);

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      };

      fetch("https://api.countrystatecity.in/v1/countries/US/states", requestOptions)
        .then(checkFetchError)
        .then(stateData => {
          const filteredStateData = stateData
            .filter(stateFilter)
            .map(state => ({
              isoCode: state.iso2,
              name: state.name,
            }));

          setStates({
            ...states,
            list: filteredStateData,
          });
        })
        .catch(() => setStates({ ...states, isFetchError: true }));
    };

    if (!states.list.length) {
      fetchStates();
    }
  }, [states]);

  // Callback that fires when the user selects a state from the dropdown
  const handleStateChange = (state) => {
    setStates({
      ...states,
      selectedState: state,
    });
    setCurrentStep(2);

    const headers = new Headers();
    headers.append("X-CSCAPI-KEY", process.env.REACT_APP_COUNTRY_STATE_CITY_API_KEY);

    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    fetch(`https://api.countrystatecity.in/v1/countries/US/states/${state}/cities`, requestOptions)
      .then(checkFetchError)
      .then(cityData => setCities({ ...cities, list: cityData }))
      .catch(() => setCities({ ...cities, isFetchError: true }));
  }

  // Callback that fires when the user selects a city from the dropdown
  const handleCityChange = (city) => {
    setCities({
      ...cities,
      selectedCity: city,
    })
    setCurrentStep(3);

    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
      .then(checkFetchError)
      .then(breweryData => setBreweries({ ...breweries, list: breweryData }))
      .catch(() => setBreweries({ ...breweries, isFetchError: true }));
  };

  // Callback that fires when the user hits the reset button; restores default state
  const handleReset = () => {
    setStates({
      ...states,
      selectedState: 'default',
      isFetchError: false,
    });
    setCities({
      list: [],
      selectedCity: 'default',
      isFetchError: false,
    });
    setBreweries({
      list: [],
      displayType: 'Random',
      isFetchError: false,
    });
    setCurrentStep(1);
    setFilter(null);
  };

  // Callback that fires when the user hits the submit button
  const handleSubmit = (event) => {
    event.preventDefault();

    setFilter({
      breweries: breweries.list,
      displayType: breweries.displayType,
      isError: breweries.isFetchError,
    })
  };

  return (
    <form className="BreweryFilter" onReset={handleReset} onSubmit={handleSubmit}>
      <div>
        <label className="BreweryFilter-flex-column">
          <p>Step 1 - Choose a State:</p>
          <select
            value={states.selectedState}
            onChange={event => handleStateChange(event.target.value)}
            disabled={currentStep !== 1}
          >
            <option value="default" disabled hidden>
              {!states.list.length ? 'Loading States...' : ''}
            </option>
            {states.list.map(state => (
              <option
                key={state.isoCode}
                value={state.isoCode}
              >
                {state.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        className={currentStep >= 2 ? 'BreweryFilter-show-step' : 'BreweryFilter-hide-step'}
      >
        <label className="BreweryFilter-flex-column">
          <p>Step 2 - Choose a City:</p>
          <select
            value={cities.selectedCity}
            onChange={event => handleCityChange(event.target.value)}
            disabled={currentStep !== 2}
          >
            <option value="default" disabled hidden>
              {!cities.list.length ? 'Loading Cities...' : ''}
            </option>
            {cities.list.map(city => (
              <option
                key={city.id}
                value={encodeURI(city.name)}
              >
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        className={currentStep === 3 ? 'BreweryFilter-flex-column' : 'BreweryFilter-hide-step'}
      >
        <p>Step 3 - Choose an Option:</p>
        <label>
          <input
            type="radio"
            value="Random"
            checked={breweries.displayType === "Random"}
            onChange={event => setBreweries({ ...breweries, displayType: event.target.value})}
          />
          Random Brewery
        </label>
        <label>
          <input
            type="radio"
            value="List"
            checked={breweries.displayType === "List"}
            onChange={event => setBreweries({ ...breweries, displayType: event.target.value})}
          />
          List of Breweries
        </label>
      </div>
      <div className='BreweryFilter-button-container'>
        <input
          type="reset"
          value="Reset"
        />
        <input
          className="BreweryFilter-submit-button"
          type="submit"
          value="Beer Me"
          disabled={currentStep !== 3}
        />
      </div>
    </form>
  );
};

export default BreweryFilter;