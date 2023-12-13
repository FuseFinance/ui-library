import FlowCanvas from '@/src/components/Editor/FlowCanvas';
import { ReactFlowProvider } from 'reactflow';

import { EditorModal } from '@/src/components/Editor/EditorModal';
import { WorkflowEditorProvider } from '@/src/contexts/WorkflowEditorProvider';
import EditorNavbar from '@/src/pages/Editor/EditorNavbar';
import { initialEdges, initialNodes } from './initialNodesAndEdges';

export default function Editor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorProvider>
        <div className="h-screen flex flex-col">
          <EditorNavbar />
          <FlowCanvas
            initialEdges={initialEdges}
            initialNodes={initialNodes}
            width="100%"
            height="100%"
          />
          <EditorModal />
        </div>
      </WorkflowEditorProvider>
    </ReactFlowProvider>
  );
}
