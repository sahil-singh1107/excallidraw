import React, { useCallback, useRef, useState } from 'react';
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0];

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState(null); // Store the selected node
  const [newLabel, setNewLabel] = useState(''); // Store the new label input

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const newNodeId = getId();
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode = {
          id: newNodeId,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${newNodeId}` },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id: `e${connectionState.fromNode.id}-${newNodeId}`,
            source: connectionState.fromNode.id,
            target: newNodeId,
          })
        );
      }
    },
    [screenToFlowPosition]
  );

  const handleClick = (e) => {
    const { clientX, clientY } = e;
    const flowPosition = screenToFlowPosition({ x: clientX, y: clientY });

    const clickedNode = nodes.find((node) => {
      const { x, y } = node.position;
      const nodeWidth = 40; // Adjust to your node's width
      const nodeHeight = 20; // Adjust to your node's height

      return (
        flowPosition.x >= x &&
        flowPosition.x <= x + nodeWidth &&
        flowPosition.y >= y &&
        flowPosition.y <= y + nodeHeight
      );
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      setNewLabel(clickedNode.data.label); // Prepopulate the input with the current label
    }
  };

  const handleLabelChange = () => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
      setSelectedNode(null); // Close the input
      setNewLabel('');
    }
  };

  return (
    <div
      ref={reactFlowWrapper}
      className="wrapper w-screen h-screen relative" // Relative for positioning the input
    >
      <ReactFlow
        onClick={handleClick}
        style={{ backgroundColor: '#F7F9FB' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
      >
        <Background />
      </ReactFlow>

      {selectedNode && (
        <div
          className="absolute bottom-4 left-4 bg-white p-4 shadow-lg rounded"
        >
          <label className="block text-sm font-medium text-gray-700">
            Update Node Label:
          </label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={handleLabelChange}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);
