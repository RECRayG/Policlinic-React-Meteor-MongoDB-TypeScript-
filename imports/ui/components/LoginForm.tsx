// @ts-ignore
import React from 'react';

// @ts-ignore
import { useForm } from 'react-hook-form';

// @ts-ignore
import { Box, Button, Stack, TextField } from '@mui/material';
// @ts-ignore
import { Meteor } from 'meteor/meteor';

interface Credentials {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<Credentials>();

  const onSubmit = ({ username, password }: Credentials) => {
    Meteor.loginWithPassword(username, password);
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="90vh">
      <h2>Войти</h2>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} width="300px">
          <TextField {...register('username')} label="Имя пользователя" />
          <TextField {...register('password')} label="Пароль" type="password" />
          <Button variant="contained" type="submit">
            Войти
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
