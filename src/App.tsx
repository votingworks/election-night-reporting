import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { useWindowWidth } from '@react-hook/window-size'

import { localeDate, localeLongDateAndTime } from './utils/IntlDateTimeFormats'

import report from './data/virgina-report.json'
import { Dictionary } from './types'
import shuffle from './utils/shuffle'

pluralize.addSingularRule('localities', 'locality')

const Screen = styled.div``
const Nav = styled.nav`
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
  padding: 0.5rem;
  background: #3e4e6d;
  color: #ffffff;
  @media (min-width: 767px) {
    padding: 1rem;
  }
`
const Main = styled.main<{ navigationHeight: number }>`
  padding-top: ${({ navigationHeight }) =>
    navigationHeight ? `${navigationHeight}px` : '150px'};
`
const Masthead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`
const Title = styled.h1`
  flex-grow: 1;
  margin: 0;
`
const LastUpdated = styled.div`
  flex-shrink: 3;
  margin-top: 0.25em;
  font-size: 0.8rem;
  @media (min-width: 767px) {
    margin-top: 0;
  }
`
const SearchBar = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (min-width: 767px) {
    flex-direction: row;
    align-items: center;
  }
`
const SearchSummary = styled.div`
  flex: 1;
  margin: 0.5em 0;
  @media (min-width: 767px) {
    margin: 0 1em 0 0;
  }
`
const SearchInput = styled.input`
  width: 100%;
  padding: 0.25rem;
  @media (min-width: 767px) {
    width: 15em;
  }
`

const LocalityName = styled.strong`
  font-size: 1.3rem;
`

const LocalitySummary = styled.div<{ isTotal: boolean }>`
  padding: ${({ isTotal }) => (isTotal ? '2rem 0.5rem' : '0.75rem 0.5rem')};
  border-bottom: ${({ isTotal }) =>
    isTotal ? '1px solid #cccccc' : undefined};
  margin-bottom: ${({ isTotal }) => (isTotal ? '0.5rem' : undefined)};
  background: ${({ isTotal }) => (isTotal ? '#eeeeee' : undefined)};
  @media (min-width: 767px) {
    padding: ${({ isTotal }) => (isTotal ? '2rem 1rem' : '1rem')};
  }

  p {
    margin: 0 0 0.2rem;
  }
`
const CompletedBar = styled.div`
  position: relative;
  font-size: 0.8rem;
  font-weight: 600;
  div {
    padding: 0 0.3rem;
    border-radius: 2rem;
    line-height: 1.4em;
  }
  div:first-child {
    background: #dddddd;
  }
  div:last-child {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background: #000000;
    color: #ffffff;
    text-align: right;
  }
`
// TODO: Move color generation into report json so that localities maintain the same color.
const randomHues = shuffle(
  report.localities.map((_, i, array) => 360 * ((i + 1) / array.length))
)
const localityColors = report.localities.reduce<Dictionary<string>>(
  (result, locality, i) => ({
    ...result,
    [locality.id]: `hsl(${randomHues[i]} 40% 40% / 1)`,
  }),
  {}
)

const sortOptions = {
  ignorePunctuation: true,
  numeric: true,
}

interface Locality {
  id: string
  name: string
  ballotsCounted: number
  ballotsExpected: number
}

const App: React.FunctionComponent = () => {
  const windowWidth = useWindowWidth()
  const [navigationHeight, setNavigationHeight] = useState<number>(0)
  const [filter, setFilter] = useState('')
  const reportTotal = report.localities.reduce<Locality>(
    (result, locality) => ({
      ...result,
      ballotsCounted: result.ballotsCounted + locality.ballotsCounted,
      ballotsExpected: result.ballotsExpected + locality.ballotsExpected,
    }),
    {
      id: 'total',
      name: 'State of Virginia',
      ballotsCounted: 0,
      ballotsExpected: 0,
    }
  )
  const localitiesByName = report.localities.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, sortOptions)
  )
  const displayLocalities = [reportTotal, ...localitiesByName]
  const filteredLocalities = displayLocalities.filter((locality) =>
    locality.name.match(new RegExp(filter, 'gi'))
  )
  const electionDate = localeDate.format(new Date(report.election.date))
  const lastUpdated = localeLongDateAndTime.format(new Date(report.lastUpdated))

  useEffect(() => {
    setNavigationHeight(
      document.getElementById('navigation')?.getBoundingClientRect().height ?? 0
    )
  }, [windowWidth])

  return (
    <Screen>
      <Nav id="navigation">
        <Masthead>
          <Title>{report.name}</Title>
          <LastUpdated>Last updated: {lastUpdated}</LastUpdated>
        </Masthead>
        <SearchBar>
          {filter ? (
            <SearchSummary>
              Showing {pluralize('locality', filteredLocalities.length, true)}{' '}
              matching “{filter}” for {electionDate} {report.election.name}
            </SearchSummary>
          ) : (
            <SearchSummary>
              Showing all{' '}
              {pluralize('locality', filteredLocalities.length, true)} for{' '}
              {electionDate} {report.election.name}
            </SearchSummary>
          )}
          <SearchInput
            type="text"
            placeholder="search by name"
            maxLength={30}
            onChange={(event) => setFilter(event.currentTarget.value)}
          />
        </SearchBar>
      </Nav>
      <Main navigationHeight={navigationHeight}>
        {filteredLocalities.map((locality) => {
          const percentComplete =
            (locality.ballotsCounted / locality.ballotsExpected) * 100

          return (
            <LocalitySummary
              key={locality.id}
              isTotal={locality.id === 'total'}
            >
              <p>
                <LocalityName>{locality.name}</LocalityName> has counted{' '}
                {locality.ballotsCounted.toLocaleString('en')} of{' '}
                {locality.ballotsExpected.toLocaleString('en')} expected ballots
                {locality.id === 'total' && <strong> in total</strong>}.
              </p>
              <CompletedBar>
                <div>
                  {percentComplete === 0
                    ? '0%'
                    : `${percentComplete.toFixed(2)}%`}
                </div>
                <div
                  style={{
                    width: `${percentComplete}%`,
                    backgroundColor: localityColors[locality.id],
                    visibility:
                      locality.ballotsCounted === 0 ? 'hidden' : undefined,
                  }}
                >
                  {`${percentComplete.toFixed(2)}%`}
                </div>
              </CompletedBar>
            </LocalitySummary>
          )
        })}
        {filteredLocalities.length === 0 && (
          <button type="button" onClick={() => setFilter('')}>
            Show all
          </button>
        )}
      </Main>
    </Screen>
  )
}

export default App
