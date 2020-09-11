import React, { useState } from 'react'
import styled from 'styled-components'
import pluralize from 'pluralize'

import { localeDate, localeLongDateAndTime } from './utils/IntlDateTimeFormats'

import report from './data/virgina-report.json'

pluralize.addSingularRule('localities', 'locality')

const Screen = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`
const Nav = styled.nav`
  padding: 1rem;
  background: #3e4e6d;
  color: #ffffff;
`
const Main = styled.main`
  display: flex;
  overflow: auto;
  flex-direction: column;
`
const MainChild = styled.div`
  margin: 1rem;
`

const Masthead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`
const Title = styled.h1`
  margin: 0;
`
const LastUpdated = styled.div`
  font-size: 0.8rem;
`
const Search = styled.input`
  width: 15rem;
  padding: 0.25rem;
`
const SearchBar = styled.label`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`

const LocalityName = styled.strong`
  font-size: 1.2rem;
`

interface LocalitySummaryProps {
  percent: number
  hue: number
}
const LocalitySummary = styled.div<LocalitySummaryProps>`
  position: relative;
  margin-bottom: 1.5rem;
  &::before {
    position: absolute;
    z-index: -1;
    bottom: 0;
    left: 0;
    display: block;
    padding: 0.1rem;
    content: attr(data-percent-label);
    font-size: 0.6rem;
    font-weight: 600;
  }
  &::after {
    display: block;
    overflow: hidden;
    width: ${({ percent }) => `${percent * 100}%`};
    padding: 0.1rem;
    background: hsl(${({ hue }) => hue} 49% 44% / 1);
    color: #ffffff;
    content: attr(data-percent-label);
    font-size: 0.6rem;
    font-weight: 600;
    text-align: right;
  }
  p {
    margin: 0 0 0.1rem;
  }
`

const App: React.FunctionComponent = () => {
  const [localities, setLocalities] = useState(report.localities)
  const [filter, setFilter] = useState('')
  const filterLocalities = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const newLocalities = report.localities.filter((l) =>
      l.name.match(new RegExp(value, 'gi'))
    )
    setFilter(value)
    setLocalities(newLocalities)
  }
  const clearFilter = () => {
    setFilter('')
    setLocalities(report.localities)
  }
  const electionDate = localeDate.format(new Date(report.election.date))
  const lastUpdated = localeLongDateAndTime.format(
    new Date(report.lastModifiedDate)
  )

  return (
    <Screen>
      <Nav>
        <Masthead>
          <Title>Virginia Locality Reporting</Title>
          <LastUpdated>Last updated: {lastUpdated}</LastUpdated>
        </Masthead>
        <SearchBar>
          {filter ? (
            <div>
              Showing {pluralize('locality', localities.length, true)} matching
              “{filter}” for {electionDate} {report.election.name}
            </div>
          ) : (
            <div>
              Showing all {pluralize('locality', localities.length, true)} for{' '}
              {electionDate} {report.election.name}
            </div>
          )}
          <Search
            type="search"
            placeholder="search by county name"
            onChange={filterLocalities}
          />
        </SearchBar>
      </Nav>
      <Main>
        <MainChild>
          {localities.map((locality) => (
            <LocalitySummary
              key={locality.id}
              hue={Math.floor(Math.random() * 360) + 1}
              percent={locality.ballotsCounted / locality.ballotsExpected}
              data-percent-label={`${(
                (locality.ballotsCounted / locality.ballotsExpected) *
                100
              ).toFixed(2)}%`}
            >
              <p>
                <LocalityName>{locality.name}</LocalityName> has counted{' '}
                {locality.ballotsCounted.toLocaleString('en')} of{' '}
                {locality.ballotsExpected.toLocaleString('en')} expected
                ballots.
              </p>
            </LocalitySummary>
          ))}
          {localities.length === 0 && (
            <button type="button" onClick={clearFilter}>
              Show all
            </button>
          )}
        </MainChild>
      </Main>
    </Screen>
  )
}

export default App
