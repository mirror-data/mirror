import { useState, useRef } from 'react';
import { Autocomplete, Loader } from '@mantine/core';
import * as React from "react";
import {fetchSuggestions} from "@/components/v2/apis";

export function QuestionInput({value, setValue, autocomplete}: {value: string, setValue: (value: string) => void, autocomplete?: boolean}) {
  const timeoutRef = useRef<number>(-1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  const handleChange = (val: string) => {
    setValue(val);
    if (!autocomplete) {
      return;
    }
    window.clearTimeout(timeoutRef.current);
    setData([]);
    // if val ends with ?, then we don't need to autocomplete
    if (val.trim().length === 0 || val.endsWith('?')) {
      setLoading(false);
    } else {
      setLoading(true);
      const fn = async () => {
        const suggestions = await fetchSuggestions(val);
        console.log('fetching', suggestions);
        if (!suggestions.error) {
          setData(suggestions.suggestions);
        }
        setLoading(false);
      }

      fn();
    }
  };
  return (
    <Autocomplete
      className="flex-grow"
      value={value}
      data={data}
      onChange={handleChange}
      rightSection={loading ? <Loader size={16} /> : null}
      label="Your Question"
    />
  );
}
