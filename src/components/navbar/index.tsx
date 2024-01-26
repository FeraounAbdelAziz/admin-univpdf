'use client';
import cx from 'clsx';

import { useState } from 'react';
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  useMantineTheme,
  Divider,
  Drawer,
  Box,
} from '@mantine/core';

import { IconListSearch } from '@tabler/icons-react';

import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';
import classes from './navbar.module.css';


import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';




const tabs = [
  'Dashboard',
  'Playground',
];


const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Playground', href: '/' },
];
const links = [
  { label: 'Dashboard', link: '/dashboard', order: 1 },
  { label: 'Playground', link: '/', order: 1 },
];


type User = {
  name: string
  email: string,
  image: string
}

type Props = {
  user: User
}



export default function Navbar() {


  const user = {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image: 'https://avatar.vercel.sh/leerob',
  };

  const pathname = usePathname();

  const theme = useMantineTheme();


  const router = useRouter()


  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);



  const items = navigation.map((tab) => (
    <Tabs.Tab  value={tab.href} key={tab.href}>
      {tab.name}
    </Tabs.Tab>
  ));

  const items_2 = links.map((item) => (
    <Box<'a'>
      component="a"
      href={item.link}
      onClick={(event) => { event.preventDefault(); router.push(item.link) }}
      key={item.label}
      className={cx(classes.link, { [classes.linkActive]: pathname === item.link })}
      style={{ paddingLeft: `calc(${item.order} * var(--mantine-spacing-md))` }}
    >
      {item.label}
    </Box>
  ));


  return (
    <>
      <div className={classes.header}>

        <Container className={classes.mainSection} size="md">
          <Group justify="space-between">


            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

            <div></div>
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                  <Group gap={7}>
                    <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {user.name}
                    </Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconHeart
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Liked posts
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconStar
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.yellow[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Saved posts
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconMessage
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Your comments
                </Menu.Item>

                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Account settings
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Change account
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Logout
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Pause subscription
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                >
                  Delete account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>


          </Group>
        </Container>
        <Container size="md">
          <Tabs
            defaultValue="/dashboard"
            variant="default"
            visibleFrom="sm"
            onChange={(value) => {
              if (value) {
                router.push(value)
              }

            }}

          >
            <Tabs.List>{items}</Tabs.List>
          </Tabs>
        </Container>

      </div>

      <Drawer
        // offset={8}
        opened={opened}
        onClose={toggle}
        transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}
      >

        <div>
          {items_2}
        </div>
      </Drawer>

    </>



  );
}
