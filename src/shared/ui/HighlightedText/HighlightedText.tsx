import { escapeRegExp } from '../../lib/escapeRegExp'
import styles from './HighlightedText.module.css'

interface HighlightedTextProps {
  text: string
  query: string
}

export const HighlightedText = ({ text, query }: HighlightedTextProps) => {
  if (!query) return text

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))
  const normalizedQuery = query.toLowerCase()

  return parts.map((part, index) =>
    part.toLowerCase() === normalizedQuery ? (
      <mark key={index} className={styles.mark}>{part}</mark>
    ) : (
      part
    ),
  )
}
