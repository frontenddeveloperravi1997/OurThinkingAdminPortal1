import { useState, useEffect } from "react";
import { Accordion, Form } from "react-bootstrap";

const MultiCheckTopicSelection = ({
  topicList,
  initialSelection,
  setValue,
}) => {
  // const generateSelectionString = (checkedRegions) => {
  //   return Object.keys(checkedRegions)
  //     .map((region) => {
  //       const selectedCountries = Object.keys(checkedRegions[region])
  //         .filter((country) => checkedRegions[region][country])
  //         .join("#");
  //       return selectedCountries ? `${region}#${selectedCountries}` : "";
  //     })
  //     .filter(Boolean) // Filter out empty strings
  //     .join("|");
  // };

  // const generateSelectionString = (checkedRegions) => {
  //     return Object.keys(checkedRegions)
  //     .map((region) => {
  //       // Collect selected countries for the current region
  //       const selectedCountries = Object.keys(checkedRegions[region])
  //         .filter((country) => checkedRegions[region][country])
  //         .map((country) => `${region}#${country}`);
  
  //       // Only include the region once and concatenate with the selected countries
  //       return selectedCountries.length > 0
  //         ? `${region}|${selectedCountries.join("|")}`
  //         : '';
  //     })
  //     .filter(Boolean) // Filter out empty strings
  //     .join("|");
  // };

  const generateSelectionString = (checkedRegions) => {
    return Object.keys(checkedRegions)
      .map((region) => {
        const selectedCountries = Object.keys(checkedRegions[region])
          .filter((country) => checkedRegions[region][country] && country !== "checked")
          .map((country) => `${region}#${country}`);
        if (selectedCountries.length > 0) {
          return selectedCountries.join("|");
        }
        if (checkedRegions[region]["checked"]) {
          return `${region}`;
        }
        return '';
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
      if (!selection[region]) {
        selection[region] = {};
      }
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

  // const areAllCountriesChecked = (newState = checkedRegions) => {
  //   return Object.values(newState).every((region) =>
  //     Object.values(region).every((isChecked) => isChecked)
  //   );
  // };
  const areAllCountriesChecked = (newState = checkedRegions) => {
    return Object.keys(topicList).every(region => {
        return topicList[region].every(country => newState[region]?.[country.SubTopicName]);
    });
};

  const getRegionCheckedState = (region) => {
    const countries = topicList[region];
    if (!countries || countries.length === 0)
      return checkedRegions[region]?.checked || false;

    return countries.every(
      (country) => checkedRegions[region]?.[country.SubTopicName]
    );
  };

  const isAnyCountrySelected = (region) => {
    const countries = topicList[region];
    if (!countries) return false;

    return countries.some(
      (country) => checkedRegions[region]?.[country.SubTopicName]
    );
  };

  const handleRegionChange = (region) => {
    const isRegionChecked = getRegionCheckedState(region);
    const newCheckedState = !isRegionChecked;

    const newCheckedRegions = { ...checkedRegions };
    if (!newCheckedRegions[region]) {
      newCheckedRegions[region] = {};
    }
    if (!topicList[region] || topicList[region].length === 0) {
      newCheckedRegions[region].checked = newCheckedState;
    } else {
      topicList[region].forEach((country) => {
        newCheckedRegions[region][country.SubTopicName] = newCheckedState;
      });
    }

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
    Object.keys(topicList).forEach((region) => {
      newCheckedRegions[region] = {};
      if (!topicList[region] || topicList[region].length === 0) {
        newCheckedRegions[region].checked = newSelectAllState;
      } else {
        topicList[region].forEach((country) => {
          newCheckedRegions[region][country.SubTopicName] = newSelectAllState;
        });
      }
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
    console.log('selectionString--',selectionString);
    setValue("topicId", selectionString);
  };

  return (
    <>
      <div
        onClick={handleSelectAllChange}
        className="d-flex justify-content-between flex-row mb-2"
      >
        <Form.Label>Select all Topics</Form.Label>
        <Form.Check
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
      </div>
      <div className="d-flex justify-content-between flex-column accordionWrap">
        {Object.keys(topicList)?.map((region, index) => {
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
                  {topicList[region]?.map((countryItem, countryIndex) => (
                    <Form
                      key={countryItem.SubTopicName}
                      className="d-flex flex-row gap-2"
                    >
                      <Form.Check
                        type="checkbox"
                        checked={
                          !!checkedRegions[region]?.[countryItem.SubTopicName]
                        }
                        onChange={() =>
                          handleCountryChange(region, countryItem.SubTopicName)
                        }
                      />
                      <Form.Label>{countryItem.SubTopicName}</Form.Label>
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

export default MultiCheckTopicSelection;
