import React from 'react';
import { CloseIcon } from './Icon';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">GHL Peak Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
           {/* Placeholder for future integrations */}
           <div className="p-4 bg-gray-900/50 rounded border border-gray-700 border-dashed">
              <p className="text-sm text-gray-400 mb-2 font-medium">System Configuration</p>
              <div className="space-y-3">
                 <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Model</label>
                    <select 
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded p-2 text-sm focus:outline-none focus:border-brand-500"
                      value={settings.modelName}
                      onChange={(e) => onSave({...settings, modelName: e.target.value})}
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Reasoning)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Integration Status</label>
                    <div className="flex items-center space-x-2 text-sm text-green-400">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       <span>System Active</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="text-xs text-gray-500">
             API Key is managed via environment variables for security.
             <br/>
             Version: 1.0.0 (GHL Peak Release)
           </div>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};