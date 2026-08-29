import { AnthimeriaWorkbench } from '@/components/anthimeria-workbench';
import { ontologyCatalog } from '@hipster-stack/core';

export default function AnthimeriaPage() {
  return (
    <AnthimeriaWorkbench
      catalog={Object.values(ontologyCatalog).map(
        ({ id, label, description, routes }) => ({
          id,
          label,
          description,
          routes,
        }),
      )}
    />
  );
}
