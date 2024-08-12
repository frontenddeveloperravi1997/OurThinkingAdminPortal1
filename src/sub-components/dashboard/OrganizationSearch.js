import React,{memo,useState,useEffect} from 'react'
import Select from 'react-select';
import { getOrgnizationData } from '@/app/api/organization';
import { toast } from "react-toastify";
const OrganizationSearch = ({defaultValue,defaultlabel,setValue}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(() => {

  
    if (defaultValue === "" && defaultlabel === "") {
      return null;
    } else {
      return {
        value: defaultValue,
        label: defaultlabel
      };
    }
  });
    // Handle input change
    const handleInputChange = (newValue) => {
      setInputValue(newValue);
    };

    const handleChange = (selectedOption) => {
  
      setSelectedOption(selectedOption);
      setValue('organization',selectedOption)
    };

  useEffect(() => {
    const fetchOptions = async () => {
      if (inputValue.trim() === '') {
        setOptions([]);
        return;
      }
      try {
        const response = await getOrgnizationData(inputValue);
     
        if(response?.statusCode === 200
        ){
          const convertingIntoFromat = response?.data?.data?.map((item)=>({
            value:item?.organizationId,
            
            label:item?.organizationName
          }))
          setOptions(convertingIntoFromat)
          
        }else{
          toast.error("Oops something went wrong!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      
   
        // setOptions(response.data); // Assuming the API returns an array of options
      } catch (error) {
        console.error('Error fetching options:', error);
        // Handle error appropriately
      }
    };

    // Debounce the API call to avoid making a call for every keystroke
    const delayDebounce = setTimeout(() => {
      fetchOptions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);
  return (
    <Select
      options={options}
      onInputChange={handleInputChange}
      onChange={handleChange}
      placeholder="Search..."
      isClearable
      value={selectedOption}
    />
  )
}

export default memo(OrganizationSearch)