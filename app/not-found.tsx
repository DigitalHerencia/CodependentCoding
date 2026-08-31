import { SystemState } from '@/components/blocks/custom/system-state';
export default function NotFound() {
  return (
    <SystemState
      code="404"
      title="Constitution not found."
      description="The requested public architecture surface does not exist."
    />
  );
}
