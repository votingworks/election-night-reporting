/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { useWindowWidth } from '@react-hook/window-size'
import {
  BrowserRouter as Router,
  Route,
  RouteProps,
  Switch,
  Redirect,
} from 'react-router-dom'

import { localeDate, localeLongDateAndTime } from './utils/IntlDateTimeFormats'

import report from './data/virgina-report.json'
import { Dictionary } from './types'
import shuffle from './utils/shuffle'
import MapboxGLMap from './components/map'
import ElectionScreen from './components/ElectionScreen'

pluralize.addSingularRule('localities', 'locality')

const Screen = styled.div``
const Navivation = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
  background: #3e4e6d;
`
const Main = styled.main<{ navigationHeight: number; isMap: boolean }>`
  padding-top: ${({ navigationHeight }) =>
    navigationHeight ? `${navigationHeight}px` : '150px'};
`
const MainChild = styled.div`
  padding: 1rem;
`
const Masthead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  color: #ffffff;
  @media (min-width: 767px) {
    flex-direction: row;
    align-items: flex-start;
    padding: 1rem;
  }
`
const TabNav = styled.nav`
  display: flex;
  padding: 0 0.5rem;
  border-bottom: 1px solid #ffffff;
  @media (min-width: 767px) {
    flex-direction: row;
    padding: 0 1rem;
  }
  button {
    display: inline-block;
    min-width: 7rem;
    box-sizing: border-box;
    flex: 1;
    padding: 0.5rem 1rem;
    border: none;
    margin: 0 0.25rem;
    background: #8798ba;
    border-radius: 0.25rem 0.25rem 0 0;
    font-size: inherit;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    &.active {
      background: #ffffff;
    }
    @media (min-width: 767px) {
      flex: 0;
      margin: 0 0.25rem;
    }
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
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid #cccccc;
  background: #ffffff;
  @media (min-width: 767px) {
    flex-direction: row;
    align-items: center;
    padding: 0.25rem 1rem;
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
  border: 1px solid #cccccc;
  border-radius: 0.25rem;
  &::placeholder {
    color: #cccccc;
  }
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

type SitePages = 'list' | 'map' | 'about'

const App: React.FunctionComponent = () => {
  const windowWidth = useWindowWidth()
  const [navigationHeight, setNavigationHeight] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<SitePages>('list')
  const [localityFilter, setLocalityFilter] = useState('')
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
    locality.name.match(new RegExp(localityFilter, 'gi'))
  )
  const electionDate = localeDate.format(new Date(report.election.date))
  const lastUpdated = localeLongDateAndTime.format(new Date(report.lastUpdated))

  useEffect(() => {
    setNavigationHeight(
      document.getElementById('navigation')?.getBoundingClientRect().height ?? 0
    )
  }, [windowWidth, localityFilter, currentPage])

  return (
    <Router>
      <Switch>
        <Route exact path="/election-night-reporting">
          <Screen>
            <Navivation id="navigation">
              <Masthead>
                <Title>{report.name}</Title>
                <LastUpdated>Last updated: {lastUpdated}</LastUpdated>
              </Masthead>
              <TabNav>
                <button
                  type="button"
                  className={currentPage === 'list' ? 'active' : ''}
                  onClick={() => setCurrentPage('list')}
                >
                  List
                </button>
                <button
                  type="button"
                  className={currentPage === 'map' ? 'active' : ''}
                  onClick={() => setCurrentPage('map')}
                >
                  Map
                </button>
                <button
                  type="button"
                  className={currentPage === 'about' ? 'active' : ''}
                  onClick={() => setCurrentPage('about')}
                >
                  About
                </button>
              </TabNav>
              {currentPage === 'list' && (
                <SearchBar>
                  {localityFilter ? (
                    <SearchSummary>
                      Showing {pluralize('locality', filteredLocalities.length, true)}{' '}
                      matching “{localityFilter}” for {electionDate}{' '}
                      {report.election.name}
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
                    onChange={(event) => setLocalityFilter(event.currentTarget.value)}
                  />
                </SearchBar>
              )}
            </Navivation>
            <Main navigationHeight={navigationHeight} isMap={currentPage === 'map'}>
              {currentPage === 'about' ? (
                <MainChild>
                  <h1>About This App</h1>
                  <p>What does it all mean?</p>
                  <p>Where is my spoon?</p>
                </MainChild>
              ) : currentPage === 'map' ? (
                <div>
                  <MapboxGLMap />
                </div>
              ) : (
                <>
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
                          {locality.ballotsExpected.toLocaleString('en')} expected
                          ballots
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
                    <button type="button" onClick={() => setLocalityFilter('')}>
                      Show all
                    </button>
                  )}
                </>
              )}
            </Main>
          </Screen>
        </Route>
        <Route path="/election" component={ElectionScreen} />
      </Switch>
    </Router>
  )
}

export default App
