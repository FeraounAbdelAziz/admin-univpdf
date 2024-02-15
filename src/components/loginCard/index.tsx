import {
    Paper,
    Title,
    Container,
    Group,
} from '@mantine/core';
import classes from './loginCard.module.css';
import { GoogleButton } from './google';
import { signInWithProvider } from '../navbar';

export default function LoginCard() {
    return (
        <Container size={460} my={30}>
            <Title  order={1} className={classes.title} ta="center">
                Login
            </Title>
            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <Group grow mb="md" mt="md">
                    <GoogleButton onClick={signInWithProvider}  radius="xl">Google</GoogleButton>
                </Group>
            </Paper>
        </Container>
    );
}

