import { useState } from 'react'
import './App.css'

const defaultForm = {
  DAYS_EMPLOYED: -14600,
  YEARS_BIRTH: 65,
  BUREAU_TOTAL_DEBT: 0,
  AMT_GOODS_PRICE: 45000,
  NAME_EDUCATION_TYPE: 'Academic degree',
  DAYS_LAST_PHONE_CHANGE: -4000,
  DAYS_ID_PUBLISH: -6000,
}

function App() {
  const [formData, setFormData] = useState(defaultForm)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'NAME_EDUCATION_TYPE' ? value : Number(value),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Prediction request failed')
      }

      const data = await response.json()
      setResult(data.status)
    } catch {
      setError('Unable to get prediction. Please try again.')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app">
      <div className="card">
        <h1>Loan Approval Predictor</h1>
        <p className="subtitle">Enter applicant values and submit to get a decision.</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            DAYS_EMPLOYED
            <input name="DAYS_EMPLOYED" type="number" value={formData.DAYS_EMPLOYED} onChange={handleChange} required />
          </label>

          <label>
            YEARS_BIRTH
            <input name="YEARS_BIRTH" type="number" step="0.1" value={formData.YEARS_BIRTH} onChange={handleChange} required />
          </label>

          <label>
            BUREAU_TOTAL_DEBT
            <input name="BUREAU_TOTAL_DEBT" type="number" step="0.1" value={formData.BUREAU_TOTAL_DEBT} onChange={handleChange} required />
          </label>

          <label>
            AMT_GOODS_PRICE
            <input name="AMT_GOODS_PRICE" type="number" step="0.1" value={formData.AMT_GOODS_PRICE} onChange={handleChange} required />
          </label>

          <select name="NAME_EDUCATION_TYPE" value={formData.NAME_EDUCATION_TYPE} onChange={handleChange} required>
            <option value="Academic degree">Academic degree</option>
            <option value="Higher education">Higher education</option>
            <option value="Incomplete higher">Incomplete higher</option>
            <option value="Secondary / secondary special">Secondary / secondary special</option>
            <option value="Lower secondary">Lower secondary</option>
          </select>

          <label>
            DAYS_LAST_PHONE_CHANGE
            <input name="DAYS_LAST_PHONE_CHANGE" type="number" value={formData.DAYS_LAST_PHONE_CHANGE} onChange={handleChange} required />
          </label>

          <label>
            DAYS_ID_PUBLISH
            <input name="DAYS_ID_PUBLISH" type="number" value={formData.DAYS_ID_PUBLISH} onChange={handleChange} required />
          </label>

          <button type="submit" disabled={loading}>{loading ? 'Checking...' : 'Predict'}</button>
        </form>

        {result && <p className={`result ${result === 'APPROVE' ? 'approve' : 'deny'}`}>{result}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </main>
  )
}

export default App
