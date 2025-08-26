import { Button, VStack, Text, Link } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../../schemas/auth.schema';
import { FormField } from '../form/FormField';
import { useAuth } from '../../store';

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await registerUser(data.email, data.password);
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
            autoComplete="new-password"
          />
          <FormField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isLoading}
            width="full"
          >
            Create Account
          </Button>
          <Text fontSize="sm" textAlign="center">
            Already have an account?{' '}
            <Link color="brand.500" href="/login">
              Sign in
            </Link>
          </Text>
        </VStack>
      </form>
    </FormProvider>
  );
}