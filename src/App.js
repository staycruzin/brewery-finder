import { useState } from 'react';
import BreweryFilter from './components/BreweryFilter/BreweryFilter';
import BreweryList from './components/BreweryList/BreweryList';
import logo from './assets/beer-logo.png';
import './App.css';

const App = () => {
  const [breweryFilter, setBreweryFilter] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Beer mug" />
        <h1>
          Brewery Finder
        </h1>
      </header>
      <BreweryFilter setFilter={setBreweryFilter} />
      {breweryFilter && !!Object.keys(breweryFilter).length && (
        <BreweryList
          breweries={breweryFilter.breweries}
          displayType={breweryFilter.displayType}
          isError={breweryFilter.isError}
        />
      )}
    </div>
  );
}

export default App;
