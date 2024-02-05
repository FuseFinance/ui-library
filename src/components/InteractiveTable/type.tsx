export interface TypeInputTableSimple {
    onAddRow?: (
        _allData: (Record<string, any>)[], 
        _newRow : Record<string, any>
    ) => void
    onRemoveRow?: (_allData: (any)[]) => void
    customAttrAddRow?: Record<string, string>
    canEdit?: boolean
    initTableData: (Record<string, any>)[]
    initTableColumns: (Record<string, any>)[]
    defaultAddInRow: Record<string, any>
    canAddRows?: boolean
    canAddColumn?: boolean
}
  