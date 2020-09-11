import React, { useState } from 'react'
import styled from 'styled-components'
import pluralize from 'pluralize'

import report from './data/virgina-report.json'

pluralize.addSingularRule('localities', 'locality')

const Page = styled.div`
  margin: 1rem;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  place-content: stretch;
  place-items: stretch;
  row-gap: 15px;
`
const LocalityName = styled.h2`
  margin: 0;
`

interface LocalitySummaryProps {
  percent: number
}
const LocalitySummary = styled.div<LocalitySummaryProps>`
  position: relative;
  &::before {
    display: block;
    overflow: hidden;
    width: ${({ percent }) => `${percent * 100}%`};
    background: #000000;
    color: #ffffff;
    content: attr(data-percent-label);
    text-align: right;
  }
  &::after {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    display: block;
    content: attr(data-percent-label);
  }
  p {
    margin: 0;
  }
`
const Search = styled.input`
  border: 1px solid #38ba5f;
`
const SearchLabel = styled.label``

const App: React.FunctionComponent = () => {
  const [localities, setLocalities] = useState(report.localities)
  const filterLocalities = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const newLocalities = report.localities.filter((l) =>
      l.name.match(new RegExp(value, 'gi'))
    )
    setLocalities(newLocalities)
  }
  return (
    <Page>
      <h1>Virginia Locality Report</h1>
      <p>
        <SearchLabel>
          filter
          <Search
            type="text"
            placeholder="filter"
            onChange={filterLocalities}
          />
        </SearchLabel>{' '}
        Showing {pluralize('locality', localities.length, true)}
      </p>
      <Grid>
        {localities.map((locality) => (
          <React.Fragment key={locality.id}>
            <LocalityName>{locality.name}</LocalityName>
            <LocalitySummary
              percent={locality.ballotsCounted / locality.ballotsExpected}
              data-percent-label={`${(
                (locality.ballotsCounted / locality.ballotsExpected) *
                100
              ).toFixed(2)}%`}
            >
              <p>
                {locality.ballotsCounted.toLocaleString('en')} ballots counted
                of {locality.ballotsExpected.toLocaleString('en')} ballots
                expected
              </p>
            </LocalitySummary>
          </React.Fragment>
        ))}
      </Grid>
    </Page>
  )
}

export default App
