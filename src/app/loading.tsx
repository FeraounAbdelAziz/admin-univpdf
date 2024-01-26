import { LoadingOverlay} from '@mantine/core';

export default function Loading() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <LoadingOverlay
        visible
        loaderProps={{
          type: 'bars'

        }}
      ></LoadingOverlay>
    </main>
  );
}
