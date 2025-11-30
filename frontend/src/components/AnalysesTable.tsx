import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Analysis } from '../types';
import { formatDate, getStatusBadgeClass, downloadJSON, exportToCSV } from '../utils/helpers';

interface AnalysesTableProps {
  analyses: Analysis[];
}

const AnalysesTable = ({ analyses }: AnalysesTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Analysis>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredAndSortedAnalyses = useMemo(() => {
    let result = [...analyses];

    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.analysis_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [analyses, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: keyof Analysis) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/analysis/${id}`);
  };

  const handleExportCSV = () => {
    const selectedData = filteredAndSortedAnalyses
      .filter(a => selectedRows.has(a.analysis_id))
      .map(a => ({
        ID: a.analysis_id,
        Filename: a.filename,
        Status: a.status,
        Created: formatDate(a.created_at),
        Completed: a.completed_at ? formatDate(a.completed_at) : '-',
      }));

    if (selectedData.length > 0) {
      exportToCSV(selectedData, 'analyses_export.csv');
    }
  };

  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredAndSortedAnalyses.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedAnalyses.map(a => a.analysis_id)));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tahlillar ro'yxati</h2>
          {selectedRows.size > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Export ({selectedRows.size})
            </button>
          )}
        </div>
        
        <input
          type="text"
          placeholder="Fayl nomi yoki ID bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredAndSortedAnalyses.length && filteredAndSortedAnalyses.length > 0}
                  onChange={toggleAllRows}
                  className="rounded border-gray-300"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('analysis_id')}
              >
                ID {sortBy === 'analysis_id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('filename')}
              >
                Fayl nomi {sortBy === 'filename' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('created_at')}
              >
                Yaratilgan {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedAnalyses.map((analysis) => (
              <tr
                key={analysis.analysis_id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(analysis.analysis_id)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(analysis.analysis_id)}
                    onChange={() => toggleRowSelection(analysis.analysis_id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {analysis.analysis_id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {analysis.filename}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge ${getStatusBadgeClass(analysis.status)}`}>
                    {analysis.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(analysis.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => downloadJSON(analysis, `analysis_${analysis.analysis_id}.json`)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Yuklash
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedAnalyses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tahlillar topilmadi</p>
        </div>
      )}
    </div>
  );
};

export default AnalysesTable;
