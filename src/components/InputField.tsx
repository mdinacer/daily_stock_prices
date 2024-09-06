'use client';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';
import { Control, FieldValues, Path } from 'react-hook-form';

interface Props<T extends FieldValues> extends InputProps {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  description?: string;
}

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...inputProps
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
