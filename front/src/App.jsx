import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

// In Docker/local dev this stays '/api' and nginx proxies it to the backend
// container. In production (Cloudflare Pages), set VITE_API_URL at build
// time to the Render backend's URL, e.g. https://your-api.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || '/api'

const defaultForm = {
  DAYS_EMPLOYED: 0,
  YEARS_BIRTH: 0,
  BUREAU_TOTAL_DEBT: 0,
  AMT_GOODS_PRICE: 0,
  NAME_EDUCATION_TYPE: '',
  DAYS_LAST_PHONE_CHANGE: 0,
  DAYS_ID_PUBLISH: 0,
}

const fieldMeta = {
  DAYS_EMPLOYED:          { label: 'Days Employed',           hint: '' },
  YEARS_BIRTH:            { label: 'Age (Years)',             hint: 'Applicant age in years' },
  BUREAU_TOTAL_DEBT:      { label: 'Bureau Total Debt',       hint: 'Total outstanding debt from credit bureau' },
  AMT_GOODS_PRICE:        { label: 'Goods Price (AMT)',       hint: 'Price of goods the loan is for' },
  DAYS_LAST_PHONE_CHANGE: { label: 'Days Since Phone Change', hint: 'Number of days ago' },
  DAYS_ID_PUBLISH:        { label: 'Days Since ID Published', hint: 'Number of days ago' },
}


function App() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(defaultForm)
  const [result, setResult] = useState('') // change this to approve if want to test approve
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [probability, setProbability] = useState(null)

  const [submittedData, setSubmittedData] = useState(null) // show used data

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'NAME_EDUCATION_TYPE' ? value : Number(value),
    }))
  }

    const validateForm = (data) => {
    if (!data.NAME_EDUCATION_TYPE) {
      return 'Please select an education level.'
    }
    if (data.YEARS_BIRTH <= 0) {
      return 'Age must be greater than 0.'
    }

    const numericFields = [
      'DAYS_EMPLOYED',
      'YEARS_BIRTH',
      'BUREAU_TOTAL_DEBT',
      'AMT_GOODS_PRICE',
      'DAYS_LAST_PHONE_CHANGE',
      'DAYS_ID_PUBLISH',
    ]

    for (const field of numericFields) {
      if (data[field] < 0) {
        return `${fieldMeta[field]?.label || field} cannot be negative.`
      }
    }

    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateForm(formData)
    const snapshot = { ...formData }
    setSubmittedData(snapshot)
    setLoading(true)
    setError('')
    setResult('') // set APPROVE TO TEST
    setProbability(null)

    try {
      // ---- comment this when API is connected, purely for testing !!!!! ----
      await new Promise((resolve) => setTimeout(resolve, 1000)) // fake network delay
      const data = {
        status: Math.random() > 0.5 ? 'APPROVE' : 'DENY',
        probability: Math.random(),
      }

      // ---- uncomment this when API is connected !!!!!!!! -----
      // const response = await fetch(`${API_BASE}/predict`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(snapshot),
      // })

      // if (!response.ok) {
      //   throw new Error('Prediction request failed')
      // }

      // const data = await response.json()

      setResult(data.status)
      setProbability(data.probability)
    } catch {
      setError('Unable to get prediction. Please try again.')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pr-root">
      {/* NAV */}
      <nav className="pr-nav">
        <button className="pr-nav-logo" onClick={() => navigate('/')}>
          <div className="pr-nav-dot" />
          CMPT 310 - Group 10
        </button>
        <ul className="pr-nav-links">
          <li>
            <button className="pr-nav-back" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </li>
        </ul>
      </nav>

      <main className="pr-main">
        {/* LEFT — form */}
        <div className="pr-left">
          <div className="pr-header">
            <h1 className="pr-title">
              Loan Default<br />
              <span className="pr-title-accent">Risk Predictor</span>
            </h1>
            <p className="pr-subtitle">
              Enter the applicant's financial details below to receive an instant approval decision.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="pr-form">
            <div className="pr-form-grid">
              {Object.entries(fieldMeta).map(([name, { label, hint }]) => (
                <div className="pr-field" key={name}>
                  <label className="pr-label" htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    className="pr-input"
                    name={name}
                    type="number"
                    step="1"
                    min='0'
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                  <span className="pr-hint">{hint}</span>
                </div>
              ))}

              <div className="pr-field pr-field-full">
                <label className="pr-label" htmlFor="NAME_EDUCATION_TYPE">Education Level</label>
                <select
                  id="NAME_EDUCATION_TYPE"
                  className="pr-input pr-select"
                  name="NAME_EDUCATION_TYPE"
                  value={formData.NAME_EDUCATION_TYPE}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Option</option>
                  <option value="Master's degree">Master's degree</option>
                  <option value="Bachelor's degree">Bachelor's degree</option>
                  <option value="High school graduate">High school graduate</option>
                  <option value="Lower secondary">Lower secondary</option>
                </select>
                <span className="pr-hint">Highest education level attained</span>
              </div>
            </div>

            <button className="pr-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="pr-spinner" />
                  Analysing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Run Prediction
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT — result panel */}
        <div className="pr-right">
          <div className="pr-result-card">
            <p className="pr-result-label">Decision</p>

            {!result && !error && !loading && (
              <div className="pr-result-empty">
                <div className="pr-result-icon">⏳</div>
                <p className="pr-result-msg">
                  Fill in the form and run a prediction to see the decision here.
                </p>
              </div>
            )}

            {loading && (
              <div className="pr-result-empty">
                <div className="pr-big-spinner" />
                <p className="pr-result-msg">Running model analysis…</p>
              </div>
            )}

            {result && !loading && (
              <div className={`pr-result-verdict ${result === 'APPROVE' ? 'pr-approve' : 'pr-deny'}`}>
                <div className="pr-verdict-icon">{result === 'APPROVE' ? '✓' : '✕'}</div>
                <div className="pr-verdict-text">{result}</div>
                {probability !== null && (
                  <div className="pr-verdict-prob">
                    Default probability: {(probability * 100).toFixed(1)}%
                  </div>
                )}
                <p className="pr-verdict-sub">
                  {result === 'APPROVE'
                    ? 'The applicant meets the risk criteria for loan approval.'
                    : 'The applicant does not meet the risk criteria at this time.'}
                </p>
                
                {/*print out variables that were used for calculations in case user changes them during calculation */}
                <p className="pr-verdict-variables">
                  <br /><br /><br />
                  <strong>Variables Used:</strong>
                  <br />
                  Days Employed: {submittedData?.DAYS_EMPLOYED}
                  <br />
                  Age (Years): {submittedData?.YEARS_BIRTH}
                  <br />
                  Bureau Total Debt: {submittedData?.BUREAU_TOTAL_DEBT}
                  <br />
                  Goods Price (AMT): {submittedData?.AMT_GOODS_PRICE}
                  <br />
                  Education Level: {submittedData?.NAME_EDUCATION_TYPE}
                  <br />
                  Days Since Phone Change: {submittedData?.DAYS_LAST_PHONE_CHANGE}
                  <br />
                  Days Since ID Published: {submittedData?.DAYS_ID_PUBLISH}
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="pr-result-empty">
                <div className="pr-result-icon">⚠️</div>
                <p className="pr-result-msg pr-error-msg">{error}</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

export default App
