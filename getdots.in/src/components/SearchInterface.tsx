import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { BsFileEarmark, BsPerson, BsFolder, BsPlay } from 'react-icons/bs'
import searchData from '../data/searchData.json'
import './SearchInterface.css'

interface SearchResult {
  id: string
  name: string
  type: string
  [key: string]: any
}

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const allResults = [
    ...searchData.people,
    ...searchData.files,
    ...searchData.folders
  ]

  const getFilteredResults = () => {
    if (!searchQuery) return []
    
    return allResults.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowResults(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowResults(value.length > 0)
  }

  return (
    <div className={`search-interface ${showResults ? 'expanded' : 'compact'}`}>
      {!showResults ? (
        // Compact initial state
        <div className="compact-search-container">
          <div className="compact-search-wrapper">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder="Searching is easier"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className="quick-access">
              <span className="shortcut-key">⌘</span>
              <span className="shortcut-text">quick access</span>
            </div>
          </div>
        </div>
      ) : (
        // Expanded state - search with results
        <div className="expanded-search-container">
          <div className="expanded-search-wrapper">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              autoFocus
            />
            <button onClick={clearSearch} className="clear-button">
              Clear
            </button>
          </div>
          
          {getFilteredResults().length > 0 && (
            <div className="search-results-container">
              <div className="search-results">
                {getFilteredResults().map(result => (
                  <SearchResultItem key={result.id} result={result} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const SearchResultItem = ({ result }: { result: SearchResult }) => {
  if (result.type === 'person') {
    return (
      <div className="result-item person-item">
        <div className="avatar-container">
          <img src={result.avatar} alt={result.name} className="avatar" />
          <div className={`status-dot ${result.statusColor}`}></div>
        </div>
        <div className="result-content">
          <h3 className="result-name">{result.name}</h3>
          <p className="result-meta">{result.status}</p>
        </div>
      </div>
    )
  }
  
  if (result.type === 'folder') {
    return (
      <div className="result-item folder-item">
        <div className="result-icon">
          <BsFolder />
        </div>
        <div className="result-content">
          <h3 className="result-name">{result.name} 
            <span className="file-count">{result.fileCount}</span>
          </h3>
          <p className="result-meta">in {result.location} • {result.lastEdited}</p>
        </div>
      </div>
    )
  }
  
  if (result.type === 'image') {
    return (
      <div className="result-item file-item">
        <div className="result-icon image-icon">
          <BsFileEarmark />
        </div>
        <div className="result-content">
          <h3 className="result-name">{result.name}</h3>
          <p className="result-meta">in {result.location} • {result.lastEdited}</p>
        </div>
      </div>
    )
  }
  
  if (result.type === 'video') {
    return (
      <div className="result-item file-item">
        <div className="result-icon video-icon">
          <BsPlay />
        </div>
        <div className="result-content">
          <h3 className="result-name">{result.name}</h3>
          <p className="result-meta">in {result.location} • {result.lastEdited}</p>
        </div>
      </div>
    )
  }
  
  return null
}

export default SearchInterface