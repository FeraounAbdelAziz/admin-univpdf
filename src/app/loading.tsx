import { LoadingOverlay} from '@mantine/core';

export default function Loading() {
  return (
    <main className="w-screen h-screen">
      <LoadingOverlay
        visible
        loaderProps={{
          type: 'bars'

        }}
      ></LoadingOverlay>
    </main>
  );
}
