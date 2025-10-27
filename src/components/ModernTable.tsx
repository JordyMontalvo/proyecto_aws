'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Eye,
  EyeOff,
  Settings,
  MoreHorizontal
} from 'lucide-react'

interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface TableProps {
  title: string
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  searchable?: boolean
  filterable?: boolean
  downloadable?: boolean
  refreshable?: boolean
  onRefresh?: () => void
  onDownload?: () => void
  emptyMessage?: string
  icon?: React.ReactNode
  className?: string
}

export default function ModernTable({
  title,
  columns,
  data,
  loading = false,
  searchable = true,
  filterable = true,
  downloadable = true,
  refreshable = true,
  onRefresh,
  onDownload,
  emptyMessage = 'No hay datos disponibles',
  icon,
  className = ''
}: TableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.key))
  )
  const [showColumnSelector, setShowColumnSelector] = useState(false)

  // Filtrar datos
  const filteredData = data.filter(item => {
    if (!searchTerm) return true
    return columns.some(col => {
      const value = item[col.key]
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue === bValue) return 0
    
    const comparison = aValue < bValue ? -1 : 1
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const toggleColumn = (columnKey: string) => {
    const newVisible = new Set(visibleColumns)
    if (newVisible.has(columnKey)) {
      newVisible.delete(columnKey)
    } else {
      newVisible.add(columnKey)
    }
    setVisibleColumns(newVisible)
  }

  const visibleColumnsList = columns.filter(col => visibleColumns.has(col.key))

  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-blue-500">{icon}</div>}
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
              {sortedData.length} elementos
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Búsqueda */}
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Selector de columnas */}
            <div className="relative">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Mostrar/Ocultar columnas"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              {showColumnSelector && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                  <div className="p-3">
                    <div className="text-sm font-medium text-slate-700 mb-2">Columnas</div>
                    <div className="space-y-1">
                      {columns.map(column => (
                        <label key={column.key} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={visibleColumns.has(column.key)}
                            onChange={() => toggleColumn(column.key)}
                            className="rounded"
                          />
                          <span className="text-slate-600">{column.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            {refreshable && onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                title="Actualizar"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {downloadable && onDownload && (
              <button
                onClick={onDownload}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Descargar"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {visibleColumnsList.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="h-3 w-3" /> : 
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                          <div className="flex flex-col">
                            <ChevronUp className="h-2 w-2 -mb-1" />
                            <ChevronDown className="h-2 w-2" />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={visibleColumnsList.length} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                    <span className="text-slate-600">Cargando datos...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnsList.length} className="px-6 py-12 text-center">
                  <div className="text-slate-500">
                    <div className="text-lg mb-2">📊</div>
                    <div>{emptyMessage}</div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  {visibleColumnsList.map(column => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con información adicional */}
      {sortedData.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div>
              Mostrando {sortedData.length} de {data.length} elementos
              {searchTerm && ` (filtrados por "${searchTerm}")`}
            </div>
            <div className="flex items-center space-x-4">
              <span>Ordenado por: {sortColumn || 'Ninguno'}</span>
              {sortColumn && (
                <span className="capitalize">{sortDirection}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
