import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';

type PickerProps = {
  options: Option[];
  onSelectOption: (option: Option) => any;
  optionRender?: (option: Option) => string;
  selected?: Option;
};

export type Option = {
  label: string;
  value: any;
};

const DefaultPicker: React.FC<PickerProps> = props => {
  const [selected, setSelected] = useState(props.options[0]);

  const handleOptionChange = (option: Option) => {
    props.onSelectOption(option);
    setSelected(option);
  };

  const currentSelectedOption = (): Option => {
    if (props.selected) return props.selected;
    if (selected) return selected;
    return {
      label: '',
      value: undefined,
    };
  };

  useEffect(() => {
    if (
      props.selected &&
      JSON.stringify(props.selected) !== JSON.stringify(selected)
    ) {
      handleOptionChange(currentSelectedOption());
    }
  }, [props.selected]);

  return (
    <Picker
      mode="dropdown"
      selectedValue={currentSelectedOption().value}
      onValueChange={(_, index) => handleOptionChange(props.options[index])}>
      {props.options.map(opt => {
        return <Picker.Item {...opt} key={opt.value} />;
      })}
    </Picker>
  );
};

export default DefaultPicker;
