'use client';
import cx from 'clsx';

import { useState, useTransition } from 'react';
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
  Drawer,
  Box,
  Alert,
  Button,
  LoadingOverlay,
  Modal,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
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
import { Session, User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { IconAlertCircle } from '@tabler/icons-react';
import { refreshSession } from '@/utils/getProviderAccessTokens';




// const navigation = [
//   { name: 'Dashboard', href: '/dashboard' },
//   { name: 'Playground', href: '/' },
// ];
const links = [
  { label: 'Dashboard', link: '/dashboard', order: 1 },
  { label: 'Playground', link: '/', order: 1 },
];




type Props = {
  user: User | null
  session: Session | null
}






export default function Navbar({ session, user }: Props) {


  const pathname = usePathname();
  const router = useRouter()




  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);



  //??? handle logout confirm layout and loading 
  const [logoutConfirmOpened, { open: logoutConfirmOpen, close: logoutConfirmClose }] = useDisclosure(false);
  const [logoutPending, setTransactionLogout] = useTransition()
  //???










  //?? routes
  const items = links.map((tab) => (
    <Tabs.Tab value={tab.link} key={tab.link}>
      {tab.label}
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
  //??

  return (
    <>
      <div className={classes.header}>

        <Container className={classes.mainSection} size="md">
          <Group justify="space-between">

            {session && <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />}

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

                    {user && <Avatar  src={user?.user_metadata.avatar_url} radius="xl" size={24} />}


                    {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}

                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {user ? user?.user_metadata.full_name : "unauthenticated"}

                    </Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>



                {!session ?
                  <Menu.Item
                    leftSection={
                      <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    onClick={() => {
                      signInWithProvider()
                    }}

                  >
                    login
                  </Menu.Item>
                  :
                  <>
                    <Menu.Item
                      leftSection={
                        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      }
                      onClick={() => {

                        logoutConfirmOpen()

                      }}

                    >
                      Logout
                    </Menu.Item>
                    {/* <Menu.Item
                      leftSection={
                        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      }
                      onClick={() => {

                        refreshSession()

                      }}

                    >
                      refresh session
                    </Menu.Item> */}
                  </>

                }


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
            {!session && <div style={{ padding: '22px 0' }}  ></div>}
            <Tabs.List> {session && items}</Tabs.List>

          </Tabs>


        </Container>

      </div>

      <Drawer
        // offset={8}
        opened={opened}
        onClose={toggle}
        transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}
      >

        {session && <div>
          {items_2}
        </div>}

      </Drawer>


      <Modal
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}


        padding={0}

        withCloseButton={false}
        opened={logoutConfirmOpened} onClose={logoutConfirmClose}  >
        <Alert variant="light" color="red" title="Confirm Action" icon={<IconAlertCircle />}>
          Are you sure you want to logout
          <Group justify='end' mt={'md'} p={'xs'} >
            <Button
              onClick={() => {
                logoutConfirmClose()
              }}

              disabled={logoutPending}

              variant='white' >cancel</Button>
            <Button color="red"
              onClick={() => {

                setTransactionLogout(async () => { await signOut(); logoutConfirmClose() })


              }}

              disabled={logoutPending}

            >logout</Button>
          </Group>
        </Alert>
        <LoadingOverlay visible={logoutPending} />

      </Modal >

    </>



  );
}


export async function signInWithProvider() {
  const supabase = createClientComponentClient();


  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/api/auth/callback',
      scopes: 'https://www.googleapis.com/auth/drive',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      },

    },
  })

  if (error) { console.error(error); return };

}


export async function signOut() {

  const supabase = createClientComponentClient();
  const { error } = await supabase.auth.signOut()

  if (error) { console.error(error); return };


}