import { useState } from 'react'
import { IoSearch, IoSettings } from 'react-icons/io5'
import { BsFileEarmark, BsPerson, BsChat, BsList, BsFolder, BsPlay } from 'react-icons/bs'
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
  const [activeTab, setActiveTab] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    Files: true,
    People: true,
    Chats: false,
    Lists: false
  })

  const allResults = [
    ...searchData.people,
    ...searchData.files,
    ...searchData.folders
  ]

  const getFilteredResults = () => {
    let results = allResults
    
    if (searchQuery) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (activeTab !== 'All') {
      if (activeTab === 'Files') {
        results = results.filter(item => item.type === 'image' || item.type === 'video' || item.type === 'folder')
      } else if (activeTab === 'People') {
        results = results.filter(item => item.type === 'person')
      }
    }

    return results
  }

  const getTabCounts = () => {
    const filteredBySearch = searchQuery ? 
      allResults.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) : 
      allResults
    
    return {
      All: filteredBySearch.length,
      Files: filteredBySearch.filter(item => item.type !== 'person').length,
      People: filteredBySearch.filter(item => item.type === 'person').length
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const toggleFilter = (filterName: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName as keyof typeof prev]
    }))
  }

  return (
    <div className="search-interface">
      <div className="search-container">
        <div className="search-input-wrapper">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="clear-button">
              Clear
            </button>
          )}
        </div>
        
        <div className="search-controls">
          <div className="tab-navigation">
            {(['All', 'Files', 'People'] as const).map(tab => {
              const count = getTabCounts()[tab]
              return (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'Files' && <BsFileEarmark className="tab-icon" />}
                  {tab === 'People' && <BsPerson className="tab-icon" />}
                  {tab} 
                  <span className="tab-count">{count}</span>
                </button>
              )
            })}
          </div>
          
          <div className="settings-wrapper">
            <button 
              className="settings-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <IoSettings />
            </button>
            
            {showFilters && (
              <div className="filter-dropdown">
                <div className="filter-item">
                  <BsFileEarmark className="filter-icon" />
                  <span>Files</span>
                  <div className={`toggle ${filters.Files ? 'active' : ''}`} 
                       onClick={() => toggleFilter('Files')}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
                <div className="filter-item">
                  <BsPerson className="filter-icon" />
                  <span>People</span> 
                  <div className={`toggle ${filters.People ? 'active' : ''}`}
                       onClick={() => toggleFilter('People')}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
                <div className="filter-item disabled">
                  <BsChat className="filter-icon" />
                  <span>Chats</span>
                  <div className={`toggle ${filters.Chats ? 'active' : ''}`}
                       onClick={() => toggleFilter('Chats')}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
                <div className="filter-item disabled">
                  <BsList className="filter-icon" />
                  <span>Lists</span>
                  <div className={`toggle ${filters.Lists ? 'active' : ''}`}
                       onClick={() => toggleFilter('Lists')}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="search-results">
          {getFilteredResults().map(result => (
            <SearchResultItem key={result.id} result={result} />
          ))}
        </div>
      </div>
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