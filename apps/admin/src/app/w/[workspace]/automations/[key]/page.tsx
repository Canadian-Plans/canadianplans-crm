import { Card, CardContent } from '@canadian-plans/ui';

import { FlowPage } from '../../../../../components/automations/flow-page';

export default async function AutomationFlowPage({
  params,
}: {
  params: Promise<{ workspace: string; key: string }>;
}) {
  const { workspace, key } = await params;
  return (
    <Card>
      <CardContent className="pt-6">
        <FlowPage workspaceSlug={workspace} flowKey={key} />
      </CardContent>
    </Card>
  );
}
