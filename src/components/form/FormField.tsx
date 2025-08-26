import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import React from 'react';

interface FormFieldProps extends Omit<InputProps, 'name'> {
  name: string;
  label: string;
}

export function FormField({ name, label, type, ...props }: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input id={name} type={type} {...register(name)} {...props} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}