import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Search, Filter, Calendar, FileIcon } from 'lucide-react';
import { mockDocuments } from '../data/mockData';
import { format } from 'date-fns';

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const documentTypes = [...new Set(mockDocuments.map(doc => doc.type))];

  const filteredDocuments = mockDocuments.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || document.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return FileText;
      case 'tax-document':
        return FileIcon;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{mockDocuments.length}</p>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {mockDocuments.filter(doc => doc.type === 'contract').length}
            </p>
            <p className="text-sm text-gray-600">Contracts</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockDocuments.filter(doc => doc.type === 'tax-document').length}
            </p>
            <p className="text-sm text-gray-600">Tax Documents</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {mockDocuments.filter(doc => doc.expiresAt && new Date(doc.expiresAt) < new Date()).length}
            </p>
            <p className="text-sm text-gray-600">Expired</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => {
          const FileIconComponent = getFileIcon(document.type);
          const isExpired = document.expiresAt && new Date(document.expiresAt) < new Date();
          
          return (
            <div key={document.id} className={`bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md ${
              isExpired ? 'border-red-200 bg-red-50' : 'border-gray-100'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <FileIconComponent className={`h-6 w-6 ${isExpired ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{document.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {document.type.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Uploaded: {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}
                </div>
                
                {document.expiresAt && (
                  <div className={`flex items-center ${isExpired ? 'text-red-600' : ''}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Expires: {format(new Date(document.expiresAt), 'MMM dd, yyyy')}
                    {isExpired && <span className="ml-2 text-xs font-medium">(EXPIRED)</span>}
                  </div>
                )}
                
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Size: {formatFileSize(document.size)}
                </div>
              </div>
              
              {isExpired && (
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <p className="text-xs text-red-800 font-medium">
                    This document has expired and needs to be renewed.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter document name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select document type</option>
                  <option value="contract">Contract</option>
                  <option value="tax-document">Tax Document</option>
                  <option value="certificate">Certificate</option>
                  <option value="policy">Policy</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}