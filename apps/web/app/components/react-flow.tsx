import React, { useState, useRef } from 'react';

const FlowBuilder = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [nodeText, setNodeText] = useState('');
  const canvasRef = useRef(null);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      const newNode = {
        id: Date.now(),
        text: 'New Node',
        position,
        isEditing: true
      };
      
      setNodes([...nodes, newNode]);
    }
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setDragging({ id: node.id, offset: {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    }});
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - rect.left - dragging.offset.x,
        y: e.clientY - rect.top - dragging.offset.y
      };
      
      setNodes(nodes.map(node => 
        node.id === dragging.id 
          ? { ...node, position: newPosition }
          : node
      ));
    }

    if (connecting) {
      const rect = canvasRef.current.getBoundingClientRect();
      setConnecting(prev => ({
        ...prev,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setConnecting(null);
  };

  const startConnection = (e, node) => {
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    setConnecting({
      startNode: node.id,
      startX: node.position.x,
      startY: node.position.y,
      endX: e.clientX - rect.left,
      endY: e.clientY - rect.top
    });
  };

  const completeConnection = (endNode) => {
    if (connecting && connecting.startNode !== endNode.id) {
      setConnections([...connections, {
        id: Date.now(),
        start: connecting.startNode,
        end: endNode.id
      }]);
    }
    setConnecting(null);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => 
      c.start !== nodeId && c.end !== nodeId
    ));
  };

  return (
    <div className="p-4 flex flex-col h-screen relative z-20">
      <div className="mb-4 flex gap-2">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            const centerX = canvasRef.current.clientWidth / 2;
            const centerY = canvasRef.current.clientHeight / 2;
            setNodes([...nodes, {
              id: Date.now(),
              text: 'New Node',
              position: { x: centerX, y: centerY },
              isEditing: true
            }]);
          }}
        >
          Add Node
        </button>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => {
            setNodes([]);
            setConnections([]);
          }}
        >
          Clear All
        </button>
      </div>

      <div 
        ref={canvasRef}
        className="flex-grow border-2 border-gray-200 rounded-lg relative bg-gray-50"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Connections */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map(conn => {
            const startNode = nodes.find(n => n.id === conn.start);
            const endNode = nodes.find(n => n.id === conn.end);
            if (!startNode || !endNode) return null;
            
            return (
              <line
                key={conn.id}
                x1={startNode.position.x}
                y1={startNode.position.y}
                x2={endNode.position.x}
                y2={endNode.position.y}
                stroke="#666"
                strokeWidth="2"
              />
            );
          })}
          {connecting && (
            <line
              x1={connecting.startX}
              y1={connecting.startY}
              x2={connecting.endX}
              y2={connecting.endY}
              stroke="#666"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            className="absolute bg-white border-2 border-gray-300 rounded-lg p-3 cursor-move shadow-md"
            style={{
              left: node.position.x,
              top: node.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
            onMouseUp={() => connecting && completeConnection(node)}
          >
            {node.isEditing ? (
              <input
                autoFocus
                className="border rounded px-2 py-1"
                value={node.text}
                onChange={(e) => {
                  setNodes(nodes.map(n =>
                    n.id === node.id
                      ? { ...n, text: e.target.value }
                      : n
                  ));
                }}
                onBlur={() => {
                  setNodes(nodes.map(n =>
                    n.id === node.id
                      ? { ...n, isEditing: false }
                      : n
                  ));
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span
                  onDoubleClick={() => {
                    setNodes(nodes.map(n =>
                      n.id === node.id
                        ? { ...n, isEditing: true }
                        : n
                    ));
                  }}
                >
                  {node.text}
                </span>
                <button
                  className="w-4 h-4 rounded-full bg-blue-500 hover:bg-blue-600"
                  onClick={(e) => startConnection(e, node)}
                />
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteNode(node.id)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowBuilder;