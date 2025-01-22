// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useState, useEffect } from 'react';

// interface AutocompleteInputProps {
//   value?: string;  // Используйте string, чтобы указать, что это строка
//   name?: string;
//   label: string;
//   suggestions: string[];
//   placeholder: string;
//   onChange: (value: string) => void;
// }

// const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
//   value = '',  
//   name,
//   label,
//   suggestions,
//   placeholder,
//   onChange
// }) => {
//   const [inputValue, setInputValue] = useState<string>(value);  // Инициализируйте локальное состояние из пропса

//   // Синхронизация локального состояния с пропсом value
//   useEffect(() => {
//     setInputValue(value);
//   }, [value]);

//   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
//   const [isFocused, setIsFocused] = useState(false);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setInputValue(value);
//     onChange(value); // Передаем значение обратно родительскому компоненту
//     setFilteredSuggestions(
//       suggestions.filter((suggestion) =>
//         suggestion.toLowerCase().includes(value.toLowerCase())
//       )
//     );
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     setInputValue(suggestion);
//     setFilteredSuggestions([]); // Скрываем список после выбора
//     onChange(suggestion); // Передаем выбранное значение родительскому компоненту
//   };

//   return (
//     <div className="relative">
//       <Label>{label}</Label>
//       <Input
//         value={inputValue}  // Отображаем текущее значение, синхронизированное с пропсом
//         onChange={handleInputChange}
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         placeholder={placeholder}
//       />
//       {isFocused && filteredSuggestions.length > 0 && (
//         <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-y-auto z-[9999]">
//           {filteredSuggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               className="p-2 cursor-pointer hover:bg-gray-200"
//               onMouseDown={() => handleSuggestionClick(suggestion)}
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AutocompleteInput;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface AutocompleteInputProps {
  value?: string;
  name?: string;
  label: string;
  suggestions: string[];
  placeholder: string;
  onChange: any;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value = '',
  name,
  label,
  suggestions,
  placeholder,
  onChange
}) => {
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Исправляем этот обработчик, чтобы передавать строку в onChange
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;  // Получаем строку из события
    setInputValue(value);
    onChange(value);  // Передаем строку в родительский компонент
    setFilteredSuggestions(
      suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    onChange(suggestion);
  };

  return (
    <div className="relative">
      <Label>{label}</Label>
      <Input
        value={inputValue}
        onChange={handleInputChange}  // Передаем строку вместо объекта события
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
      />
      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-y-auto z-[9999]">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
