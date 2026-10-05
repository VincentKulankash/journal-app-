import { useState } from "react";

const INITIAL_ENTRIES = [
    { id: 1, title: 'First entry', body: 'Today I set up the Journal App project.', created_at: '2026-10-06T09:00:00' },
  { id: 2, title: 'Second entry', body: 'The front end is starting to take shape.', created_at: '2026-10-06T14:30:00' },
  { id: 3, title: 'Third entry', body: 'Wired up the login page.', created_at: '2026-10-07T08:15:00' },
]

function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
    })
}

function Journal({ user, onLogout }) {
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const [selectedId, setSelectedId] = useState(null)
  const [editing, setEditing] = useState(false)

  // form state — used only while editing
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')

  const selectedEntry = entries.find((e) => e.id === selectedId) || null

  //actions

  function selectEntry(id) {
    setSelectedId(id)
    setEditing(false)
  }

  function startNewEntry() {
    setSelectedId(null)
    setEditing(true)
    setDraftTitle('')
    setDraftBody('')
  }

  function startEditing() {
    if (!selectedEntry) return
    setEditing(true)
    setDraftTitle(selectedEntry.title)
    setDraftBody(selectedEntry.body)
  }

  function cancelEditing() {
    setEditing(false)
    setDraftTitle('')
    setDraftBody('')
  }

  function saveEntry(e) {
    e.preventDefault()

    if (!draftTitle.trim() || !draftBody.trim()) return

    if (selectedEntry) {
      // update existing
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === selectedEntry.id
            ? { ...entry, title: draftTitle.trim(), body: draftBody.trim() }
            : entry
        )
      )
    } else {
      // create new
      const nextId = entries.length ? Math.max(...entries.map((e) => e.id)) + 1 : 1
      const newEntry = {
        id: nextId,
        title: draftTitle.trim(),
        body: draftBody.trim(),
        created_at: new Date().toISOString(),
      }
      setEntries((prev) => [newEntry, ...prev])
      setSelectedId(nextId)
    }

    setEditing(false)
    setDraftTitle('')
    setDraftBody('')
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    if (selectedId === id) setSelectedId(null)
        setEditing(false)
  }

  return (
    <div className="page journal-page">
      <header className="journal-header">
        <h1>Welcome, {user.username}</h1>
        <button onClick={onLogout}>Log out</button>
      </header>

      <div className="journal-body">
        {/* LEFT — list */}
        <aside className="entry-list">
          <div className="entry-list-header">
            <h2>Your entries</h2>
            <button onClick={startNewEntry}>+ New</button>
          </div>

          {entries.length === 0 ? (
            <p className="muted">No entries yet.</p>
          ) : (
            <ul>
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className={entry.id === selectedId ? 'selected' : ''}
                  onClick={() => selectEntry(entry.id)}
                >
                  <span className="entry-id">#{entry.id}</span>
                  <span className="entry-title">{entry.title}</span>
                  <span className="entry-date">{formatDate(entry.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* RIGHT — detail / editor */}
        <main className="entry-detail">
          {editing ? (
            <form onSubmit={saveEntry} className="entry-editor">
              <h2>{selectedEntry ? 'Edit entry' : 'New entry'}</h2>

              <label>
                Title
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
              </label>

              <label>
                Body
                <textarea
                  rows={10}
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                />
              </label>

              <div className="editor-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEditing}>Cancel</button>
              </div>
            </form>
          ) : selectedEntry ? (
            <article>
              <header className="detail-header">
                <div>
                  <h2>{selectedEntry.title}</h2>
                  <small>{formatDate(selectedEntry.created_at)}</small>
                </div>
                <div>
                  <button onClick={startEditing}>Edit</button>
                  <button className="danger" onClick={() => deleteEntry(selectedEntry.id)}>
                    Delete
                  </button>
                </div>
              </header>
              <p className="entry-body">{selectedEntry.body}</p>
            </article>
          ) : (
            <p className="muted empty-state">
              Select an entry from the list, or click <strong>+ New</strong> to create one.
            </p>
          )}
        </main>
      </div>
    </div>
  )

}


export default Journal
