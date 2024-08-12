// MultiSelectDropdown.js
import { Dropdown, Form } from 'react-bootstrap';

const MultiSelectDropdown = ({ options, selectedOptions, setSelectedOptions }) => {
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, name]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== name));
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic" className="w-100 text-muted multiselectdropdown">
        Select Languages
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100 multiselectdropdownMenu">
        {options.map((option) => (
          <Form.Check
            key={option.value}
            type="checkbox"
            label={option.label}
            name={option.value}
            checked={selectedOptions.includes(option.value)}
            onChange={handleCheckboxChange}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MultiSelectDropdown;
