import { useState, useEffect, useCallback } from 'react';
import { getCalculationWithChildren } from '../../api/calculations';
import { getCalculationId } from '../../utils/calculations';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import TreeNode from './TreeNode';

export default function CalculationTreeView({ 
  rootCalculation, 
  onAddOperation,
  onTreeUpdate,
}) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loadingNodes, setLoadingNodes] = useState(new Set());
  const [nodeChildrenCache, setNodeChildrenCache] = useState(new Map());

  const rootId = getCalculationId(rootCalculation);

  // Fetch root and its direct children initially
  useEffect(() => {
    const fetchRoot = async () => {
      if (!rootId) return;

      setLoading(true);
      setError('');

      try {
        const response = await getCalculationWithChildren(rootId, 100);
        const rootNode = {
          ...response.calculation,
          children: response.children || [],
        };
        setTree(rootNode);
        // Auto-expand root node
        setExpandedNodes(new Set([rootId]));
        // Cache root's children
        setNodeChildrenCache((prev) => {
          const newMap = new Map(prev);
          newMap.set(rootId, response.children || []);
          return newMap;
        });
      } catch (err) {
        setError(err.message || 'Failed to load tree.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoot();
  }, [rootId]);

  // Refresh root and all expanded nodes when onTreeUpdate trigger changes
  useEffect(() => {
    if (onTreeUpdate > 0 && rootId) {
      const refreshTree = async () => {
        try {
          // Refresh root
          const rootResponse = await getCalculationWithChildren(rootId, 100);
          const rootNode = {
            ...rootResponse.calculation,
            children: rootResponse.children || [],
          };
          setTree(rootNode);
          
          // Update cache for root and refresh all expanded nodes
          setNodeChildrenCache((prev) => {
            const newMap = new Map(prev);
            newMap.set(rootId, rootResponse.children || []);
            return newMap;
          });
          
          // Refresh all currently expanded nodes (use current state via callback)
          setExpandedNodes((currentExpanded) => {
            const expandedArray = Array.from(currentExpanded);
            expandedArray.forEach(async (nodeId) => {
              if (nodeId !== rootId) {
                try {
                  const nodeResponse = await getCalculationWithChildren(nodeId, 100);
                  setNodeChildrenCache((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(nodeId, nodeResponse.children || []);
                    return newMap;
                  });
                } catch (err) {
                  console.error(`Error refreshing node ${nodeId}:`, err);
                }
              }
            });
            return currentExpanded; // Preserve expanded state
          });
        } catch (err) {
          console.error('Error refreshing tree:', err);
        }
      };
      refreshTree();
    }
  }, [onTreeUpdate, rootId]);

  // Load children for a node when it's expanded
  const loadNodeChildren = useCallback(async (nodeId) => {
    // Check if already cached
    if (nodeChildrenCache.has(nodeId)) {
      return;
    }

    // Check if already loading
    if (loadingNodes.has(nodeId)) {
      return;
    }

    setLoadingNodes((prev) => new Set(prev).add(nodeId));

    try {
      const response = await getCalculationWithChildren(nodeId, 100);
      const children = response.children || [];
      
      // Cache the children
      setNodeChildrenCache((prev) => {
        const newMap = new Map(prev);
        newMap.set(nodeId, children);
        return newMap;
      });
    } catch (err) {
      console.error(`Error loading children for node ${nodeId}:`, err);
    } finally {
      setLoadingNodes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    }
  }, [nodeChildrenCache, loadingNodes]);

  const handleToggleExpand = useCallback(async (nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      const isCurrentlyExpanded = newSet.has(nodeId);
      
      if (isCurrentlyExpanded) {
        // Collapse
        newSet.delete(nodeId);
      } else {
        // Expand - load children if not already loaded
        newSet.add(nodeId);
        loadNodeChildren(nodeId);
      }
      
      return newSet;
    });
  }, [loadNodeChildren]);

  // Helper function to get node with its children from cache
  // MUST be defined before any early returns to follow Rules of Hooks
  const getNodeWithChildren = useCallback((node) => {
    const nodeId = getCalculationId(node);
    const cachedChildren = nodeChildrenCache.get(nodeId);
    
    if (cachedChildren !== undefined) {
      return {
        ...node,
        children: cachedChildren,
      };
    }
    
    // If not in cache, return node as-is (children might be pre-loaded)
    return node;
  }, [nodeChildrenCache]);

  // Early returns AFTER all hooks
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!tree) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tree data available.
      </div>
    );
  }

  return (
    <div className="py-4 pl-2">
      {tree && (
        <TreeNode
          node={getNodeWithChildren(tree)}
          depth={0}
          isRoot={true}
          onAddOperation={onAddOperation}
          expandedNodes={expandedNodes}
          onToggleExpand={handleToggleExpand}
          nodeChildrenCache={nodeChildrenCache}
          loadingNodes={loadingNodes}
          getNodeWithChildren={getNodeWithChildren}
        />
      )}
    </div>
  );
}

