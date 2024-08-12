import { useState, useEffect } from "react";
import { Accordion, Form } from "react-bootstrap";

const MultiCheckAccordion = ({ regionsList, initialSelection, setValue }) => {
  // const generateSelectionString = (checkedRegions) => {
  //     return Object.keys(checkedRegions)
    
  //     .map((region) => {
  //       const selectedCountries = Object.keys(checkedRegions[region])
  //         .filter((country) => checkedRegions[region][country])
  //         .join("#");
          
  //       return selectedCountries ? `${region}#${selectedCountries}` : "";
  //     })
  //     .filter(Boolean)
  //     .join("|");
  // };



  const generateSelectionString = (checkedRegions) => {
  return Object.keys(checkedRegions)
    .flatMap((region) => {
      return Object.keys(checkedRegions[region])
        .filter((country) => checkedRegions[region][country])
        .map((country) => `${region}#${country}`);
    })
    .filter(Boolean)
    .join("|");
};



  
  

  const [checkedRegions, setCheckedRegions] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isSelectAllClicked, setIsSelectAllClicked] = useState(false);

  const parseInitialSelection = (selectionString) => {
    const selection = {};
    const regions = selectionString.split("|");
    regions.forEach((regionStr) => {
      const [region, ...countries] = regionStr.split("#");
      selection[region] = {};
      countries.forEach((country) => {
        selection[region][country] = true;
      });
    });
    return selection;
  };

  useEffect(() => {
    if (initialSelection) {
      const initialCheckedRegions = parseInitialSelection(initialSelection);
      setCheckedRegions(initialCheckedRegions);
      // setSelectAll(areAllCountriesChecked(initialCheckedRegions));
    }
  }, [initialSelection]);

  const areAllCountriesChecked = (newState = checkedRegions) => {
    return Object.keys(regionsList).every(region => {
      //console.log('areAllCountriesChecked region--',region);
        return regionsList[region].every(country => newState[region]?.[country.relatedCountry]);
    });
};

  const getRegionCheckedState = (region) => {
    //console.log('region checked items--',region);
    const countries = regionsList[region];
    if (!countries) return false;

    return countries.every(
      (country) => checkedRegions[region]?.[country.relatedCountry]
    );
  };

  const isAnyCountrySelected = (region) => {
    const countries = regionsList[region];
    if (!countries) return false;

    return countries.some(
      (country) => checkedRegions[region]?.[country.relatedCountry]
    );
  };

  const handleRegionChange = (region) => {
    const isRegionChecked = getRegionCheckedState(region);
    const newCheckedState = !isRegionChecked;

    const newCheckedRegions = { ...checkedRegions };
    if (!newCheckedRegions[region]) {
      newCheckedRegions[region] = {};
    }
    regionsList[region].forEach((country) => {
      newCheckedRegions[region][country.relatedCountry] = newCheckedState;
    });

    setCheckedRegions(newCheckedRegions);
    setSelectAll(areAllCountriesChecked(newCheckedRegions));
    updateSelectionString(newCheckedRegions);
  };

  const handleCountryChange = (region, countryID) => {
    const newCheckedRegions = {
      ...checkedRegions,
      [region]: {
        ...checkedRegions[region],
        [countryID]: !checkedRegions[region]?.[countryID],
      },
    };

    setCheckedRegions(newCheckedRegions);
    setSelectAll(areAllCountriesChecked(newCheckedRegions));
    updateSelectionString(newCheckedRegions);
  };

  const handleSelectAllChange = () => {

    setIsSelectAllClicked((prev) => !prev);
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);

    const newCheckedRegions = {};
    Object.keys(regionsList).forEach((region) => {
      //console.log('region--',region);
      //console.log('regionsList--',regionsList);
      newCheckedRegions[region] = {};
      regionsList[region].forEach((country) => {
        newCheckedRegions[region][country.relatedCountry] = newSelectAllState;
      });
    });

    setCheckedRegions(newCheckedRegions);
    updateSelectionString(newCheckedRegions);
  };

  useEffect(() => {
    if (isSelectAllClicked) {
      setSelectAll(areAllCountriesChecked());
    }
  }, [checkedRegions, isSelectAllClicked]);

  const updateSelectionString = (newCheckedRegions) => {
    const selectionString = generateSelectionString(newCheckedRegions);
    console.log('countries selection string--',selectionString)
    setValue("countryId", selectionString);
  };

  return (
    <>
      <div
        onClick={handleSelectAllChange}
        className="d-flex justify-content-between flex-row mb-2"
      >
        <Form.Label>Select all Countries</Form.Label>
        <Form.Check
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
      </div>
      <div className="d-flex justify-content-between flex-column accordionWrap">
        {Object.keys(regionsList)?.map((region, index) => {
          return (
            <Accordion key={index}>
              <Accordion.Item eventKey={String(index)}>
                <Accordion.Header
                  className={`d-flex flex-row p-0 ${
                    isAnyCountrySelected(region) &&
                    !getRegionCheckedState(region)
                      ? "partial-selected"
                      : ""
                  }`}
                >
                  <Form.Check
                    type="checkbox"
                    checked={getRegionCheckedState(region)}
                    onChange={() => handleRegionChange(region)}
                  />
                  <p className="m-0 p-2">{region}</p>
                </Accordion.Header>
                <Accordion.Body className="py-2">
                  {regionsList[region]?.map((countryItem, countryIndex) => (
                    <Form
                      key={countryItem.relatedCountry}
                      className="d-flex flex-row gap-2"
                    >
                      <Form.Check
                        type="checkbox"
                        checked={
                          !!checkedRegions[region]?.[countryItem.relatedCountry]
                        }
                        onChange={() =>
                          handleCountryChange(
                            region,
                            countryItem.relatedCountry
                          )
                        }
                      />
                      <Form.Label>{countryItem.relatedCountry}</Form.Label>
                    </Form>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}
      </div>
    </>
  );
};

export default MultiCheckAccordion;
