/**
 * Cost Calculator Tabs Component
 * Includes Interior Cost Calculator and Construction Cost Calculator
 * Styled to match Merraki Interior Design Template
 */

import { useState } from 'react'
import InteriorCalculator from './InteriorCalculator'
import ConstructionCalculator from './ConstructionCalculator'

const CostCalculatorTabs = () => {
  const [activeTab, setActiveTab] = useState('interior')

  return (
    <section className="calculator-section">
      <div className="container">
        {/* Header Section with Icon */}
        <div className="row">
          <div className="col-12">
            <div className="calculator_content" data-aos="fade-up">
              <div className="calculator-icon-wrapper">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <h6>Cost Estimator</h6>
              <h2>Get Instant Cost Estimates</h2>
              <p className="text-size-18">Calculate the approximate cost for your interior design or construction project with our smart calculator</p>
              <div className="calculator-features">
                <span className="feature-badge"><i className="fa-solid fa-check-circle"></i> Accurate Estimates</span>
                <span className="feature-badge"><i className="fa-solid fa-check-circle"></i> Instant Results</span>
                <span className="feature-badge"><i className="fa-solid fa-check-circle"></i> No Hidden Costs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10 col-md-12 col-12">
            <div className="calculator-tabs d-flex justify-content-center gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab('interior')}
                className={`calculator-tab-btn ${activeTab === 'interior' ? 'active' : ''}`}
              >
                <i className="fa-solid fa-couch"></i>
                <span>Interior Cost Calculator</span>
              </button>
              <button
                onClick={() => setActiveTab('construction')}
                className={`calculator-tab-btn ${activeTab === 'construction' ? 'active' : ''}`}
              >
                <i className="fa-solid fa-building"></i>
                <span>Construction Cost Calculator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            <div className="calculator-content-wrapper" data-aos="fade-up">
              {activeTab === 'interior' ? <InteriorCalculator /> : <ConstructionCalculator />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CostCalculatorTabs
