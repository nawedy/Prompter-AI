import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderPlus, Edit2, Trash2 } from 'lucide-react';
import type { Folder as FolderType } from '../types';
import { usePromptStore } from '../store/promptStore';

interface FolderTreeProps {
  selectedFolderId?: string;
  onSelectFolder: (folderId?: string) => void;
}

export function FolderTree({ selectedFolderId, onSelectFolder }: FolderTreeProps) {
  const { folders, addFolder, updateFolder, deleteFolder } = usePromptStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolderId, setEditingFolderId] = useState<string>();
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const renderFolder = (folder: FolderType, level = 0) => {
    const hasChildren = folders.some(f => f.parentId === folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const isEditing = editingFolderId === folder.id;

    return (
      <div key={folder.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center p-2 rounded-md ${
            isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100'
          }`}
        >
          <button
            onClick={() => hasChildren && toggleFolder(folder.id)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4" />
            )}
          </button>
          
          <Folder className="h-4 w-4 mx-2" />
          
          {isEditing ? (
            <input
              type="text"
              value={folder.name}
              onChange={e => updateFolder(folder.id, { name: e.target.value })}
              onBlur={() => setEditingFolderId(undefined)}
              onKeyDown={e => e.key === 'Enter' && setEditingFolderId(undefined)}
              className="flex-1 px-2 py-1 border rounded"
              autoFocus
            />
          ) : (
            <button
              onClick={() => onSelectFolder(folder.id)}
              className="flex-1 text-left px-2 py-1"
            >
              {folder.name}
            </button>
          )}
          
          <div className="flex space-x-1">
            <button
              onClick={() => setEditingFolderId(folder.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteFolder(folder.id)}
              className="p-1 hover:bg-gray-200 rounded text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {isExpanded &&
          folders
            .filter(f => f.parentId === folder.id)
            .map(child => renderFolder(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Folders</h3>
        <button
          onClick={() => setShowNewFolderInput(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>

      {showNewFolderInput && (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="flex-1 px-3 py-2 border rounded"
            onKeyDown={e => e.key === 'Enter' && handleAddFolder()}
            autoFocus
          />
          <button
            onClick={handleAddFolder}
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1">
        {folders
          .filter(f => !f.parentId)
          .map(folder => renderFolder(folder))}
      </div>
    </div>
  );
}