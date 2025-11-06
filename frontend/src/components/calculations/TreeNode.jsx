import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { formatCalculation, formatRelativeTime } from '../../utils/formatters';
import { getCalculationId } from '../../utils/calculations';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

// TreeNode component with expand/collapse functionality using Plus/Minus icons

export default function TreeNode({ 
  node, 
  depth = 0, 
  isLast = false, 
  isRoot = false,
  onAddOperation,
  expandedNodes = new Set(),
  onToggleExpand,
  nodeChildrenCache = new Map(),
  loadingNodes = new Set(),
  getNodeWithChildren,
}) {
  const { isAuthenticated } = useAuth();
  const nodeId = getCalculationId(node);
  
  // Check if node has children (either in children array or childCount > 0)
  const hasChildren = (node.children && node.children.length > 0) || (node.childCount > 0);
  const isExpanded = expandedNodes.has(nodeId);
  const isLoading = loadingNodes.has(nodeId);
  
  // Get children from cache or from node
  const children = nodeChildrenCache.has(nodeId) 
    ? nodeChildrenCache.get(nodeId) 
    : (node.children || []);
  
  const indent = depth * 40;

  const handleAddOperation = (e) => {
    e.stopPropagation();
    if (nodeId && onAddOperation) {
      onAddOperation(nodeId);
    }
  };

  const handleToggle = () => {
    if (hasChildren && onToggleExpand) {
      onToggleExpand(nodeId);
    }
  };
  
  // Show loading indicator if children are being loaded
  const showLoadingIndicator = isLoading && isExpanded && children.length === 0;

  return (
    <div className="relative">
      <div
        className="relative flex items-start gap-3 py-1"
        style={{ paddingLeft: depth > 0 ? `${indent}px` : '0' }}
      >
        {/* Connector lines for non-root nodes */}
        {!isRoot && (
          <>
            {/* Vertical line from parent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"
              style={{ left: `${indent - 24}px` }}
            />
            {/* Horizontal line to node */}
            <div
              className="absolute top-3 h-0.5 bg-gray-300"
              style={{
                left: `${indent - 24}px`,
                width: '24px',
              }}
            />
            {/* Vertical line continuation (if not last sibling) */}
            {!isLast && (
              <div
                className="absolute top-3 bottom-0 w-0.5 bg-gray-300"
                style={{ left: `${indent - 24}px` }}
              />
            )}
          </>
        )}

        {/* Expand/Collapse button */}
        <div className="flex-shrink-0 flex items-center justify-center">
          {hasChildren ? (
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-300 hover:border-blue-400"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              ) : isExpanded ? (
                <Minus size={16} strokeWidth={3} />
              ) : (
                <Plus size={16} strokeWidth={3} />
              )}
            </button>
          ) : (
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          )}
        </div>

        {/* Node content */}
        <div
          className={`flex-1 bg-white rounded-lg border-2 p-3 shadow-sm hover:shadow-md transition-all ${
            isRoot
              ? 'border-blue-400 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div
                className={`font-bold mb-1 break-words ${
                  isRoot ? 'text-xl text-blue-900' : 'text-base text-gray-900'
                }`}
              >
                {formatCalculation(node)}
              </div>
              <div className="text-xs text-gray-500 flex flex-wrap gap-x-2">
                <span>
                  by <span className="font-medium text-blue-600">@{node.authorUsername}</span>
                </span>
                <span>•</span>
                <span>{formatRelativeTime(node.createdAt)}</span>
                {node.childCount > 0 && (
                  <>
                    <span>•</span>
                    <span>{node.childCount} {node.childCount === 1 ? 'reply' : 'replies'}</span>
                  </>
                )}
              </div>
            </div>

            {isAuthenticated && nodeId && (
              <Button
                variant="secondary"
                onClick={handleAddOperation}
                className="flex-shrink-0 text-xs px-2 py-1"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Add</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div className="relative ml-0">
          {showLoadingIndicator ? (
            <div className="py-2 pl-8 text-sm text-gray-500 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span>Loading children...</span>
            </div>
          ) : children.length > 0 ? (
            children.map((child, index) => {
              const childId = getCalculationId(child);
              const isLastChild = index === children.length - 1;
              // Get child with its cached children
              const childWithChildren = getNodeWithChildren 
                ? getNodeWithChildren(child)
                : child;
              
              return (
                <TreeNode
                  key={childId}
                  node={childWithChildren}
                  depth={depth + 1}
                  isLast={isLastChild}
                  onAddOperation={onAddOperation}
                  expandedNodes={expandedNodes}
                  onToggleExpand={onToggleExpand}
                  nodeChildrenCache={nodeChildrenCache}
                  loadingNodes={loadingNodes}
                  getNodeWithChildren={getNodeWithChildren}
                />
              );
            })
          ) : (
            <div className="py-2 pl-8 text-sm text-gray-400">
              No children
            </div>
          )}
        </div>
      )}
    </div>
  );
}

