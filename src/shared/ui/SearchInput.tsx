interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput = ({ value, onChange, placeholder = 'Поиск...' }: SearchInputProps) => (
  <input
    type="search"
    value={value}
    placeholder={placeholder}
    onChange={(event) => onChange(event.target.value)}
    style={{ padding: '8px 12px', width: '100%', boxSizing: 'border-box' }}
  />
)
