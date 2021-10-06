import './BreweryList.css';

const renderBrewery = (brewery) => {
  const {
    name,
    street,
    postal_code,
    website_url
  } = brewery;

  return (
    <div>
      <p><b>{name}</b></p>
      <p><em>{`Address: ${street}, ${postal_code}`}</em></p>
      <p>
        <em>
          {website_url
            ? (
              <a
                href={website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {website_url}
              </a>
            )
            : "No website found"
          }
        </em>
      </p>
    </div>
  )
};

const BreweryList = ({
  breweries,
  displayType,
  isError,
}) => {
  // Filter out any breweries that don't have a street address listed
  const filteredBreweries = breweries.filter(brewery => brewery?.street);

  if (isError) {
    // An error occurred while fetching the list of breweries
    return (
      <p className="error-text centered-text">
        Something went wrong. Please try again later.
      </p>
    );
  }

  if (!filteredBreweries.length) {
    // No breweries were found for the requested city/state combo
    return (
      <p className="centered-text">
        No breweries found. Please try again using a different state/city combination
      </p>
    )
  }

  if (displayType === 'Random') {
    // Random brewery option was selected; randomly display a brewery from the list
    const randomBrewery = filteredBreweries[Math.floor(Math.random() * filteredBreweries.length)];

    return (
      <div className="BreweryList-list-container">
        <p className="BreweryList-results-text">
          Results
        </p>
        <div className="BreweryList-list-item">
          {renderBrewery(randomBrewery)}
        </div>
      </div>
    );
  }

  // List of breweries option was selected; display all breweries from the list
  return (
    <ul className="BreweryList-list-container">
      <p className="BreweryList-results-text">
        Results
      </p>
      {filteredBreweries.map(brewery => (
        <li
          key={brewery.id}
          className="BreweryList-list-item"
        >
          {renderBrewery(brewery)}
        </li>
      ))}
    </ul>
  );
};

export default BreweryList;