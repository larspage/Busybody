import { Button, VStack, Checkbox } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';
import { FormField } from '../form/FormField';
import { useAuth } from '../../store';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { handleSubmit, register } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await login(data.email, data.password);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <VStack spacing={4} align="stretch">
          <FormField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <FormField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Checkbox {...register('rememberMe')}>
            Remember me
          </Checkbox>
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isLoading}
            width="full"
          >
            Sign In
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
}